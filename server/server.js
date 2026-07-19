const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "exams.db");
const JSON_DATA_FILE = path.join(DATA_DIR, "exams.json");

const seedExams = [
  {
    id: 1,
    title: "React Basics",
    status: "Published",
    examCode: "ABC123",
    questions: [],
    submitted: false,
    submittedAnswers: [],
    grade: null,
  },
  {
    id: 2,
    title: "Java",
    status: "Draft",
    examCode: "JAVA22",
    questions: [],
    submitted: false,
    submittedAnswers: [],
    grade: null,
  },
];

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
    examCode: row.examCode,
    questions: parseJson(row.questions, []),
    submitted: Boolean(row.submitted),
    submittedAnswers: parseJson(row.submittedAnswers, []),
    grade: row.grade === null ? null : row.grade,
  };
}

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    ensureDataDir();

    const db = new sqlite3.Database(DB_FILE, (error) => {
      if (error) {
        reject(error);
        return;
      }

      db.serialize(() => {
        db.run(`
          CREATE TABLE IF NOT EXISTS exams (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Draft',
            examCode TEXT,
            questions TEXT NOT NULL DEFAULT '[]',
            submitted INTEGER NOT NULL DEFAULT 0,
            submittedAnswers TEXT NOT NULL DEFAULT '[]',
            grade TEXT
          )
        `);

        db.get("SELECT COUNT(*) AS count FROM exams", (countError, row) => {
          if (countError) {
            reject(countError);
            return;
          }

          if (row.count === 0) {
            let initialExams = seedExams;

            if (fs.existsSync(JSON_DATA_FILE)) {
              try {
                const raw = fs.readFileSync(JSON_DATA_FILE, "utf8");
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  initialExams = parsed;
                }
              } catch (error) {
                console.error("Failed to read existing exams data file:", error.message);
              }
            }

            const stmt = db.prepare(`
              INSERT INTO exams (id, title, status, examCode, questions, submitted, submittedAnswers, grade)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            initialExams.forEach((exam) => {
              stmt.run(
                exam.id,
                exam.title || "Untitled",
                exam.status || "Draft",
                exam.examCode || null,
                JSON.stringify(exam.questions || []),
                exam.submitted ? 1 : 0,
                JSON.stringify(exam.submittedAnswers || []),
                exam.grade ?? null
              );
            });

            stmt.finalize(() => resolve(db));
            return;
          }

          resolve(db);
        });
      });
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
  res.send("Exam API is running");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/exams", async (req, res) => {
  try {
    const db = await dbPromise;
    const rows = await runQuery(db, "SELECT * FROM exams ORDER BY id");
    res.json(rows.map(mapExamRow));
  } catch (error) {
    console.error("Failed to fetch exams:", error.message);
    res.status(500).json({ message: "Failed to fetch exams" });
  }
});

app.post("/api/exams", async (req, res) => {
  try {
    const db = await dbPromise;
    const exam = req.body || {};
    const newExam = {
      id: exam.id || Date.now(),
      title: exam.title || "Untitled",
      status: exam.status || "Draft",
      examCode: exam.examCode || null,
      questions: exam.questions || [],
      submitted: Boolean(exam.submitted),
      submittedAnswers: exam.submittedAnswers || [],
      grade: exam.grade ?? null,
    };

    await runStatement(
      db,
      `
        INSERT INTO exams (id, title, status, examCode, questions, submitted, submittedAnswers, grade)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        newExam.id,
        newExam.title,
        newExam.status,
        newExam.examCode,
        JSON.stringify(newExam.questions),
        newExam.submitted ? 1 : 0,
        JSON.stringify(newExam.submittedAnswers),
        newExam.grade,
      ]
    );

    res.status(201).json(newExam);
  } catch (error) {
    console.error("Failed to create exam:", error.message);
    res.status(500).json({ message: "Failed to create exam" });
  }
});

app.put("/api/exams/:id", async (req, res) => {
  try {
    const db = await dbPromise;
    const id = Number(req.params.id);
    const currentRows = await runQuery(db, "SELECT * FROM exams WHERE id = ?", [id]);

    if (currentRows.length === 0) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const currentExam = mapExamRow(currentRows[0]);
    const updates = req.body || {};

    const updatedExam = {
      ...currentExam,
      ...updates,
      id,
      questions: updates.questions || currentExam.questions,
      submittedAnswers: updates.submittedAnswers || currentExam.submittedAnswers,
      submitted: updates.submitted !== undefined ? Boolean(updates.submitted) : currentExam.submitted,
    };

    await runStatement(
      db,
      `
        UPDATE exams
        SET title = ?, status = ?, examCode = ?, questions = ?, submitted = ?, submittedAnswers = ?, grade = ?
        WHERE id = ?
      `,
      [
        updatedExam.title,
        updatedExam.status,
        updatedExam.examCode,
        JSON.stringify(updatedExam.questions),
        updatedExam.submitted ? 1 : 0,
        JSON.stringify(updatedExam.submittedAnswers),
        updatedExam.grade,
        id,
      ]
    );

    res.json(updatedExam);
  } catch (error) {
    console.error("Failed to update exam:", error.message);
    res.status(500).json({ message: "Failed to delete exam" });
  }
});

app.delete("/api/exams/:id", async (req, res) => {
  try {
    const db = await dbPromise;
    const id = Number(req.params.id);
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
