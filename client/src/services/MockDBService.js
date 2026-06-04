import { exams } from "../data/mockData";

class MockDBService {
  getExams() {
    return exams;
  }
}

export default new MockDBService();