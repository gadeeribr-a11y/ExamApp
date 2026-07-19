const API_URL = "http://localhost:5000/api/exams";

const ApiService = {
  async getExams() {
    const response = await fetch(API_URL);
    return await response.json();
  },

  async createExam(exam) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(exam),
    });

    return await response.json();
  },

  async updateExam(id, exam) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(exam),
    });

    return await response.json();
  },

  async deleteExam(id) {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  },
};

export default ApiService;