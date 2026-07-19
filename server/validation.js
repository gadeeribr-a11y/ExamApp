const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EXAM_STATUSES = new Set(["Draft", "Published", "Closed"]);

function validateRegistration(email, password, name) {
  if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
    return "Please provide a valid email address";
  }

  if (typeof password !== "string" || password.length < 8) {
    return "Password must contain at least 8 characters";
  }

  if (name !== undefined && (typeof name !== "string" || !name.trim() || name.trim().length > 80)) {
    return "Name must contain between 1 and 80 characters";
  }

  return null;
}

function validateExam(exam) {
  if (typeof exam.title !== "string" || !exam.title.trim()) {
    return "An exam title is required";
  }

  if (exam.status && !EXAM_STATUSES.has(exam.status)) {
    return "Exam status must be Draft, Published, or Closed";
  }

  if (exam.questions !== undefined && !Array.isArray(exam.questions)) {
    return "Questions must be a list";
  }

  if (exam.durationMinutes !== undefined && (!Number.isInteger(Number(exam.durationMinutes)) || Number(exam.durationMinutes) < 1 || Number(exam.durationMinutes) > 240)) {
    return "Duration must be between 1 and 240 minutes";
  }

  return null;
}

module.exports = { validateExam, validateRegistration };
