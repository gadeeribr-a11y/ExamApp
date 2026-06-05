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
}

export default new MockDBService();