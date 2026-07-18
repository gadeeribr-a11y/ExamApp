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

      <h4 className="mb-3">Student Submissions</h4>

      {exam?.submissions?.length > 0 ? (
        exam.submissions.map((submission, index) => (
          <div key={submission.id} className="card mb-4">
            <div className="card-body">
              <h5>Submission #{index + 1}</h5>

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
                defaultValue={submission.grade ?? ""}
                onBlur={(e) => {
                  submission.grade = e.target.value;
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="alert alert-warning">
          No submissions yet.
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