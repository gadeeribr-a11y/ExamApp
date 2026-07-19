const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, "data", "exams.json");

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

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(seedExams, null, 2));
  }
}

function readExams() {
  ensureDataFile();

  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to read exams data file:", error.message);
    return seedExams;
  }
}

function writeExams(exams) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(exams, null, 2));
}

let exams = readExams();

app.get("/", (req, res) => {
  res.send("Exam API is running");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/exams", (req, res) => {
  res.json(exams);
});

app.post("/api/exams", (req, res) => {
  const newExam = {
    id: Date.now(),
    ...req.body,
  };

  exams = [...exams, newExam];
  writeExams(exams);

  res.status(201).json(newExam);
});

app.put("/api/exams/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = exams.findIndex((exam) => exam.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Exam not found" });
  }

  exams[index] = {
    ...exams[index],
    ...req.body,
    id,
  };

  writeExams(exams);
  res.json(exams[index]);
});

app.delete("/api/exams/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = exams.findIndex((exam) => exam.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Exam not found" });
  }

  exams = exams.filter((exam) => exam.id !== id);
  writeExams(exams);

  res.json({ message: "Exam deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});