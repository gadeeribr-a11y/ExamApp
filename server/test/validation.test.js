const test = require("node:test");
const assert = require("node:assert/strict");
const { validateExam, validateRegistration } = require("../validation");

test("registration validation accepts a valid email and strong-enough password", () => {
  assert.equal(validateRegistration("teacher@example.com", "password123", "Teacher Name"), null);
});

test("registration validation rejects unsafe account input", () => {
  assert.equal(validateRegistration("not-an-email", "password123", "Teacher Name"), "Please provide a valid email address");
  assert.equal(validateRegistration("teacher@example.com", "short", "Teacher Name"), "Password must contain at least 8 characters");
  assert.equal(validateRegistration("teacher@example.com", "password123", ""), "Name must contain between 1 and 80 characters");
});

test("exam validation accepts valid exams and rejects invalid state", () => {
  assert.equal(validateExam({ title: "Algorithms", status: "Draft", questions: [] }), null);
  assert.equal(validateExam({ title: "", status: "Draft" }), "An exam title is required");
  assert.equal(validateExam({ title: "Algorithms", status: "Archived" }), "Exam status must be Draft, Published, or Closed");
  assert.equal(validateExam({ title: "Algorithms", questions: {} }), "Questions must be a list");
});
