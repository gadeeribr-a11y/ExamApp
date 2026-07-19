import React, { useState } from "react";

function ViewAnswersPage({
  exam,
  onBack,
  onSaveGrade,
}) {
  const [submissions, setSubmissions] = useState(exam?.submissions || []);

  const saveGrades = () => {
    onSaveGrade({ ...exam, submissions });
  };

  return (
    <div className="container mt-4">
      <h1>Student Answers</h1>

      <h4 className="mb-3">
        {exam?.title}
      </h4>

      <p>
        <strong>Exam Code:</strong>{" "}
        {exam?.examCode}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {exam?.status}
      </p>

      <hr />

      <h4 className="mb-3">Student Submissions</h4>

      {submissions.length > 0 ? (
        submissions.map((submission, index) => (
          <div key={submission.id} className="card mb-4">
            <div className="card-body">
              <h5>Submission #{index + 1}</h5>
              <p className="text-muted mb-2">{submission.studentEmail || "Student"} · {new Date(submission.submittedAt).toLocaleString()}</p>

              {Object.entries(submission.submittedAnswers).map(
                ([questionId, answer]) => (
                  <div key={questionId} className="mb-3">
                    <strong>
                      {exam.questions?.find(
                        (q) =>
                          String(q.id) ===
                          String(questionId)
                      )?.text}
                    </strong>

                    <p>{answer}</p>
                  </div>
                )
              )}

              <input
                type="number"
                className="form-control mt-3"
                placeholder="Grade"
                min="0"
                max="100"
                value={submission.grade ?? ""}
                onChange={(e) => setSubmissions((current) => current.map((item) => (
                  item.id === submission.id ? { ...item, grade: e.target.value } : item
                )))}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="alert alert-warning">
          No submissions yet.
        </div>
      )}

      <button
        className="btn btn-success me-2"
        onClick={saveGrades}
      >
        Save Grades
      </button>

      <button
        className="btn btn-secondary"
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
}

export default ViewAnswersPage;
