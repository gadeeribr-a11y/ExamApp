import { exams as initialExams } from "../data/mockData";

class MockDBService {
  constructor() {
    const saved = localStorage.getItem("exams");

    if (!saved) {
      localStorage.setItem(
        "exams",
        JSON.stringify(initialExams)
      );
    }
  }

  getExams() {
    return JSON.parse(
      localStorage.getItem("exams")
    );
  }

  saveExams(exams) {
    localStorage.setItem(
      "exams",
      JSON.stringify(exams)
    );
  }
  getExamById(id) {
  return this.getExams().find(exam => exam.id === id);
}

updateExam(updatedExam) {
  const exams = this.getExams();

  const index = exams.findIndex(
    exam => exam.id === updatedExam.id
  );

  if (index !== -1) {
    exams[index] = updatedExam;
    this.saveExams(exams);
  }
}

updateQuestion(examId, questionId, updatedQuestion) {
  const exams = this.getExams();

  const exam = exams.find(e => e.id === examId);

  if (!exam) return;

  const questionIndex = exam.questions.findIndex(
    q => q.id === questionId
  );

  if (questionIndex !== -1) {
    exam.questions[questionIndex] = updatedQuestion;
    this.saveExams(exams);
  }
}

getTeacherExams(ownerId) {
  return this.getExams().filter(
    exam => exam.ownerId === ownerId
  );
}
}

export default new MockDBService();