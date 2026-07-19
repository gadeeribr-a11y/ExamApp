const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateExam, validateRegistration } = require("./validation");

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "exams.db");
const CLIENT_BUILD_PATH = path.join(__dirname, "..", "client", "dist");
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

app.use(cors());
app.use(express.json());

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function parseJson(value, fallback = []) {
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function mapExamRow(row) {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    startDate: row.startDate || "",
    examCode: row.examCode,
    ownerId: row.ownerId ?? null,
    questions: parseJson(row.questions, []),
    submitted: Boolean(row.submitted),
    submittedAnswers: parseJson(row.submittedAnswers, []),
    submissions: parseJson(row.submissions, []),
    grade: row.grade === null ? null : row.grade,
  };
}

function mapExamForStudent(row) {
  const exam = mapExamRow(row);

  return {
    ...exam,
    questions: exam.questions.map(({ correctAnswer, ...question }) => question),
    submissions: [],
    submittedAnswers: [],
    grade: null,
  };
}

function mapUserRow(row) {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    createdAt: row.createdAt,
  };
}

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, async (error, payload) => {
    if (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    try {
      const db = await dbPromise;
      const rows = await runQuery(db, "SELECT * FROM users WHERE id = ?", [payload.id]);

      if (rows.length === 0) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = mapUserRow(rows[0]);
      next();
    } catch (dbError) {
      console.error("Authentication failed:", dbError.message);
      return res.status(500).json({ message: "Authentication failed" });
    }
  });
}

function requireTeacher(req, res, next) {
  if (!req.user || req.user.role !== "teacher") {
    return res.status(403).json({ message: "Teacher access required" });
  }

  next();
}

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    ensureDataDir();

    const db = new sqlite3.Database(DB_FILE, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (error) => {
      if (error) {
        reject(error);
        return;
      }

      db.serialize(() => {
        db.run("PRAGMA journal_mode = WAL");
        db.run("PRAGMA synchronous = NORMAL");
        db.run("PRAGMA busy_timeout = 5000");
        db.run(`
          CREATE TABLE IF NOT EXISTS exams (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Draft',
            startDate TEXT NOT NULL DEFAULT '',
            examCode TEXT,
            questions TEXT NOT NULL DEFAULT '[]',
            submitted INTEGER NOT NULL DEFAULT 0,
            submittedAnswers TEXT NOT NULL DEFAULT '[]',
          grade TEXT,
          submissions TEXT NOT NULL DEFAULT '[]'
          )
        `);

        db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            passwordHash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'student',
            createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `);

        db.all("PRAGMA table_info(exams)", (pragmaError, columns) => {
          if (pragmaError) {
            reject(pragmaError);
            return;
          }

          const migrations = [];
          if (!columns.some((column) => column.name === "ownerId")) {
            migrations.push("ALTER TABLE exams ADD COLUMN ownerId INTEGER");
          }
          if (!columns.some((column) => column.name === "submissions")) {
            migrations.push("ALTER TABLE exams ADD COLUMN submissions TEXT NOT NULL DEFAULT '[]'");
          }
          if (!columns.some((column) => column.name === "startDate")) {
            migrations.push("ALTER TABLE exams ADD COLUMN startDate TEXT NOT NULL DEFAULT ''");
          }

          Promise.all(migrations.map((query) => runStatement(db, query)))
            .then(() => seedDatabase(db))
            .then(() => resolve(db))
            .catch(reject);
        });
      });
    });
  });
}

function seedDatabase(db) {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) AS count FROM users", (countError, userRow) => {
      if (countError) {
        reject(countError);
        return;
      }

      if (userRow.count === 0) {
        const defaultPasswordHash = bcrypt.hashSync("teacher123", 10);
        db.run(
          "INSERT INTO users (email, passwordHash, role) VALUES (?, ?, ?)",
          ["teacher@example.com", defaultPasswordHash, "teacher"],
          (insertError) => {
            if (insertError) {
              reject(insertError);
              return;
            }

            continueSeeding(db).then(resolve).catch(reject);
          }
        );
        return;
      }

      continueSeeding(db).then(resolve).catch(reject);
    });
  });
}

function continueSeeding(db) {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) AS count FROM exams", (countError, examRow) => {
      if (countError) {
        reject(countError);
        return;
      }

      resolve();
    });
  });
}

const dbPromise = initializeDatabase();

function runQuery(db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows);
    });
  });
}

function runStatement(db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (error) {
      if (error) {
        reject(error);
        return;
      }

      resolve(this);
    });
  });
}

app.get("/", (req, res) => {
  if (fs.existsSync(CLIENT_BUILD_PATH)) {
    res.set("Cache-Control", "no-cache");
    return res.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
  }

  res.send("Exam API is running");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const db = await dbPromise;
    const { email, password, role } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const validationError = validateRegistration(email, password);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const normalizedRole = role === "teacher" ? "teacher" : "student";
    const existingRows = await runQuery(db, "SELECT id FROM users WHERE email = ?", [email.toLowerCase()]);

    if (existingRows.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const result = await runStatement(
      db,
      "INSERT INTO users (email, passwordHash, role) VALUES (?, ?, ?)",
      [email.toLowerCase(), passwordHash, normalizedRole]
    );

    const userRows = await runQuery(db, "SELECT * FROM users WHERE id = ?", [result.lastID]);
    const user = mapUserRow(userRows[0]);

    res.status(201).json({
      user,
      token: createToken(user),
    });
  } catch (error) {
    console.error("Register failed:", error.message);
    res.status(500).json({ message: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const db = await dbPromise;
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const rows = await runQuery(db, "SELECT * FROM users WHERE email = ?", [email.toLowerCase()]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userRow = rows[0];
    const isValid = bcrypt.compareSync(password, userRow.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = mapUserRow(userRow);
    res.json({ user, token: createToken(user) });
  } catch (error) {
    console.error("Login failed:", error.message);
    res.status(500).json({ message: "Login failed" });
  }
});

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  res.json({ user: req.user });
});

app.get("/api/exams", authenticateToken, async (req, res) => {
  try {
    const db = await dbPromise;
    const isTeacher = req.user.role === "teacher";
    const query = isTeacher
      ? "SELECT * FROM exams WHERE ownerId = ? ORDER BY id"
      : "SELECT * FROM exams WHERE status = 'Published' ORDER BY id";
    const rows = await runQuery(db, query, isTeacher ? [req.user.id] : []);
    res.json(rows.map(req.user.role === "teacher" ? mapExamRow : mapExamForStudent));
  } catch (error) {
    console.error("Failed to fetch exams:", error.message);
    res.status(500).json({ message: "Failed to fetch exams" });
  }
});

app.post("/api/exams", authenticateToken, requireTeacher, async (req, res) => {
  try {
    const db = await dbPromise;
    const exam = req.body || {};
    const validationError = validateExam(exam);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const newExam = {
      id: exam.id || Date.now(),
      title: exam.title || "Untitled",
      status: exam.status || "Draft",
      startDate: exam.startDate || "",
      examCode: exam.examCode || null,
      ownerId: req.user.id,
      questions: exam.questions || [],
      submitted: Boolean(exam.submitted),
      submittedAnswers: exam.submittedAnswers || [],
      grade: exam.grade ?? null,
    };

    await runStatement(
      db,
      `
        INSERT INTO exams (id, title, status, startDate, examCode, questions, submitted, submittedAnswers, grade, ownerId, submissions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        newExam.id,
        newExam.title,
        newExam.status,
        newExam.startDate,
        newExam.examCode,
        JSON.stringify(newExam.questions),
        newExam.submitted ? 1 : 0,
        JSON.stringify(newExam.submittedAnswers),
        newExam.grade,
        newExam.ownerId,
        JSON.stringify([]),
      ]
    );

    res.status(201).json(newExam);
  } catch (error) {
    console.error("Failed to create exam:", error.message);
    res.status(500).json({ message: "Failed to create exam" });
  }
});

app.put("/api/exams/:id", authenticateToken, requireTeacher, async (req, res) => {
  try {
    const db = await dbPromise;
    const id = Number(req.params.id);
    const currentRows = await runQuery(db, "SELECT * FROM exams WHERE id = ?", [id]);

    if (currentRows.length === 0) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const currentExam = mapExamRow(currentRows[0]);

    const updates = req.body || {};
    const validationError = validateExam({ ...currentExam, ...updates });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updatedExam = {
      ...currentExam,
      ...updates,
      id,
      ownerId: req.user.id,
      startDate: updates.startDate ?? currentExam.startDate,
      questions: updates.questions || currentExam.questions,
      submittedAnswers: updates.submittedAnswers || currentExam.submittedAnswers,
      submissions: Array.isArray(updates.submissions) ? updates.submissions : currentExam.submissions,
      submitted: updates.submitted !== undefined ? Boolean(updates.submitted) : currentExam.submitted,
    };

    await runStatement(
      db,
      `
        UPDATE exams
        SET title = ?, status = ?, startDate = ?, examCode = ?, questions = ?, submitted = ?, submittedAnswers = ?, grade = ?, ownerId = ?, submissions = ?
        WHERE id = ?
      `,
      [
        updatedExam.title,
        updatedExam.status,
        updatedExam.startDate,
        updatedExam.examCode,
        JSON.stringify(updatedExam.questions),
        updatedExam.submitted ? 1 : 0,
        JSON.stringify(updatedExam.submittedAnswers),
        updatedExam.grade,
        updatedExam.ownerId,
        JSON.stringify(updatedExam.submissions),
        id,
      ]
    );

    res.json(updatedExam);
  } catch (error) {
    console.error("Failed to update exam:", error.message);
    res.status(500).json({ message: "Failed to update exam" });
  }
});

app.post("/api/exams/:id/submissions", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit exams" });
    }

    const id = Number(req.params.id);
    const answers = req.body?.answers;
    if (!Number.isInteger(id) || !answers || typeof answers !== "object" || Array.isArray(answers)) {
      return res.status(400).json({ message: "A valid exam and answers are required" });
    }

    const db = await dbPromise;
    const rows = await runQuery(db, "SELECT * FROM exams WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Exam not found" });

    const exam = mapExamRow(rows[0]);
    if (exam.status !== "Published") {
      return res.status(400).json({ message: "This exam is not accepting submissions" });
    }
    if (exam.submissions.some((submission) => submission.studentId === req.user.id)) {
      return res.status(409).json({ message: "You have already submitted this exam" });
    }

    const submission = {
      id: Date.now(),
      studentId: req.user.id,
      studentEmail: req.user.email,
      submittedAnswers: answers,
      submittedAt: new Date().toISOString(),
      grade: null,
    };
    const submissions = [...exam.submissions, submission];
    await runStatement(db, "UPDATE exams SET submissions = ? WHERE id = ?", [JSON.stringify(submissions), id]);
    res.status(201).json({ submission });
  } catch (error) {
    console.error("Failed to submit exam:", error.message);
    res.status(500).json({ message: "Failed to submit exam" });
  }
});

app.delete("/api/exams/:id", authenticateToken, requireTeacher, async (req, res) => {
  try {
    const db = await dbPromise;
    const id = Number(req.params.id);
    const currentRows = await runQuery(db, "SELECT * FROM exams WHERE id = ?", [id]);

    if (currentRows.length === 0) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const currentExam = mapExamRow(currentRows[0]);
    if (currentExam.ownerId !== null && currentExam.ownerId !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own exams" });
    }

    const result = await runStatement(db, "DELETE FROM exams WHERE id = ?", [id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.error("Failed to delete exam:", error.message);
    res.status(500).json({ message: "Failed to delete exam" });
  }
});

if (fs.existsSync(CLIENT_BUILD_PATH)) {
  app.use(express.static(CLIENT_BUILD_PATH));
}

app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API endpoint not found" });
  }

  if (req.path.startsWith("/assets/")) {
    return res.status(404).send("Asset not found");
  }

  if (fs.existsSync(CLIENT_BUILD_PATH)) {
    res.set("Cache-Control", "no-cache");
    return res.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
  }

  res.status(404).send("Frontend build not found. Run npm run build in the client folder.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
