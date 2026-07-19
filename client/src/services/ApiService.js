const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const API_URL = `${API_BASE_URL}/exams`;

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: getAuthHeaders(),
    ...options,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

const ApiService = {
  async getExams() {
    return request(API_URL);
  },

  async createExam(exam) {
    return request(API_URL, {
      method: "POST",
      body: JSON.stringify(exam),
    });
  },

  async updateExam(id, exam) {
    return request(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(exam),
    });
  },

  async deleteExam(id) {
    return request(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  },
};

export default ApiService;