import React from "react";

function StudentResultsPage({ results, onBack }) {
  return (
    <div className="container mt-5">
      <h1>My Results</h1>
      <p className="text-muted">Completed exams and the grades assigned by your teacher.</p>

      {results.length === 0 ? (
        <div className="alert alert-info">You have not completed any exams yet.</div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>Exam</th><th>Grade</th></tr></thead>
            <tbody>
              {results.map((result) => (
                <tr key={`${result.examId}-${result.submittedAt}`}>
                  <td>{result.examTitle}</td>
                  <td>{result.grade ?? "Not graded yet"}</td>
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

export default StudentResultsPage;
