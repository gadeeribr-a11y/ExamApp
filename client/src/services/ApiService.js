const developmentApiUrl = `http://${window.location.hostname || "127.0.0.1"}:5000/api`;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? developmentApiUrl : "/api");
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
    try {
      const parsed = JSON.parse(details);
      throw new Error(parsed.message || `Request failed with status ${response.status}`);
    } catch (error) {
      if (error.message !== details) {
        throw error;
      }
      throw new Error(details || `Request failed with status ${response.status}`);
    }
  }

  if (response.status === 204) {
    return null;
  }

  // A successful response can legitimately have no body. Read it once before
  // parsing so an empty JSON response does not surface as a SyntaxError.
  const body = await response.text();
  if (!body) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(body);
    } catch {
      throw new Error("The server returned an invalid JSON response.");
    }
  }

  return body;
}

const ApiService = {
  async login(email, password) {
    return request(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async register(email, password, role, name) {
    return request(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify({ email, password, role, name }),
    });
  },

  async getMe() {
    return request(`${API_BASE_URL}/auth/me`);
  },

  async getExams() {
    return request(API_URL);
  },

  async requestPasswordReset(email) {
    return request(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async getMySubmissions() {
    return request(`${API_BASE_URL}/student/submissions`);
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

  async submitExam(id, answers) {
    return request(`${API_URL}/${id}/submissions`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
  },
};

export default ApiService;
