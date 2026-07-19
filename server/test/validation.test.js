const test = require("node:test");
const assert = require("node:assert/strict");
const { validateExam, validateRegistration } = require("../validation");

test("registration validation accepts a valid email and strong-enough password", () => {
  assert.equal(validateRegistration("teacher@example.com", "password123"), null);
});

test("registration validation rejects unsafe account input", () => {
  assert.equal(validateRegistration("not-an-email", "password123"), "Please provide a valid email address");
  assert.equal(validateRegistration("teacher@example.com", "short"), "Password must contain at least 8 characters");
});

test("exam validation accepts valid exams and rejects invalid state", () => {
  assert.equal(validateExam({ title: "Algorithms", status: "Draft", questions: [] }), null);
  assert.equal(validateExam({ title: "", status: "Draft" }), "An exam title is required");
  assert.equal(validateExam({ title: "Algorithms", status: "Archived" }), "Exam status must be Draft, Published, or Closed");
  assert.equal(validateExam({ title: "Algorithms", questions: {} }), "Questions must be a list");
});
