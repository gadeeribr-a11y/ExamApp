import React from "react";

function SubmissionListPage({ exams, onBack, onViewAnswers }) {
  const submissions = exams.flatMap((exam) =>
    (exam.submissions || []).map((submission) => ({ exam, submission }))
  );

  return (
    <div className="container mt-4">
      <h1>Submitted Exams</h1>
      <p className="text-muted">All submissions from every student account for your exams.</p>

      {submissions.length === 0 ? (
        <div className="alert alert-info">No student submissions yet.</div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Exam</th><th>Student</th><th>Submitted</th><th>Grade</th><th /></tr></thead>
            <tbody>
              {submissions.map(({ exam, submission }) => (
                <tr key={`${exam.id}-${submission.id}`}>
                  <td>{exam.title}</td>
                  <td>{submission.studentName || submission.studentEmail || "Student"}</td>
                  <td>{submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : "—"}</td>
                  <td>{submission.grade ?? "Not graded"}</td>
                  <td><button className="btn btn-success btn-sm" onClick={() => onViewAnswers(exam)}>View / Grade</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="btn btn-secondary" onClick={onBack}>Back to Exams</button>
    </div>
  );
}

export default SubmissionListPage;
