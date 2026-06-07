import { useState } from "react";

function ViewAnswersPage({
  exam,
  onBack,
  onSaveGrade,
}) {
  const [grade, setGrade] = useState(
    exam?.grade || ""
  );

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

      <h4 className="mb-3">
        Submitted Answers
      </h4>

      {exam?.submittedAnswers &&
      Object.keys(exam.submittedAnswers)
        .length > 0 ? (
        Object.entries(
          exam.submittedAnswers
        ).map(([questionId, answer]) => (
          <div
            key={questionId}
            className="card mb-3"
          >
            <div className="card-body">
              <h6>
            {
                exam.questions?.find(
                (q) => String(q.id) === String(questionId)
                )?.text || `Question ${questionId}`
            }
            </h6>
              <p className="mb-0">
                <strong>
                  Student Answer:
                </strong>{" "}
                {answer}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="alert alert-warning">
          No submitted answers yet.
        </div>
      )}

      <hr />

      <h4>Grade Student</h4>

      <input
        type="number"
        min="0"
        max="100"
        className="form-control mb-3"
        value={grade}
        onChange={(e) =>
          setGrade(e.target.value)
        }
      />

      <button
        className="btn btn-success me-2"
        onClick={() =>
          onSaveGrade(grade)
        }
      >
        Save Grade
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