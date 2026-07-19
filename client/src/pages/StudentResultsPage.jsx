import React from "react";

function StudentResultsPage({ results, onBack }) {
  const gradedResults = results.filter((result) => result.grade !== null && result.grade !== undefined && result.grade !== "" && !Number.isNaN(Number(result.grade)));
  const averageGrade = gradedResults.length
    ? (gradedResults.reduce((sum, result) => sum + Number(result.grade), 0) / gradedResults.length).toFixed(1)
    : "—";

  return (
    <div className="container mt-5">
      <h1>My Results</h1>
      <p className="text-muted">Completed exams and the grades assigned by your teacher.</p>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h2 className="h5 mb-1">Average Grade</h2>
            <p className="text-muted mb-0">Based on {gradedResults.length} graded exam{gradedResults.length === 1 ? "" : "s"}.</p>
          </div>
          <div className="display-6 fw-bold">{averageGrade}</div>
        </div>
      </div>

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
