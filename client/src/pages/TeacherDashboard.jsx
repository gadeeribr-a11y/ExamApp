import React from "react";
import NotificationService from "../services/NotificationService";

function TeacherDashboard({ exams, setExams, onCreateExam, onEditExam, onViewAnswers, onLogout, onDeleteExam, onUpdateExam }) {
  const totalExams = exams.length;
  const publishedCount = exams.filter((exam) => exam.status === "Published").length;
  const draftCount = exams.filter((exam) => exam.status === "Draft").length;
  const closedCount = exams.filter((exam) => exam.status === "Closed").length;
  const submittedCount = exams.filter((exam) => exam.submitted).length;
  const averageGrade = exams.filter((exam) => exam.grade !== null && exam.grade !== undefined && exam.grade !== "").length
    ? (
        exams.reduce((sum, exam) => sum + Number(exam.grade || 0), 0) /
        exams.filter((exam) => exam.grade !== null && exam.grade !== undefined && exam.grade !== "").length
      ).toFixed(1)
    : "—";

  const updateExams = (updater) => {
    const updated = updater(exams);
    setExams(updated);
    return updated;
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
        <div>
          <h1 className="mb-1">Teacher Dashboard</h1>
          <p className="text-muted mb-0">Monitor exam progress, manage drafts, and keep your assessments organized.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={onCreateExam}>
            Create Exam
          </button>
          <button className="btn btn-outline-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="stats-card">
            <span>Total Exams</span>
            <strong>{totalExams}</strong>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stats-card">
            <span>Published</span>
            <strong>{publishedCount}</strong>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stats-card">
            <span>Drafts</span>
            <strong>{draftCount}</strong>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="stats-card">
            <span>Submitted</span>
            <strong>{submittedCount}</strong>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex justify-content-between flex-wrap align-items-center">
          <div>
            <h5 className="mb-1">Performance snapshot</h5>
            <p className="text-muted mb-0">Average grade is shown for exams that already have a score.</p>
          </div>
          <div className="display-6 fw-bold">{averageGrade}</div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>Code</th>
              <th>Submission</th>
              <th>Grade</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.title}</td>
                <td>{exam.status}</td>
                <td>{exam.startDate || "—"}</td>
                <td>
                  <code>{exam.examCode}</code>
                </td>
                <td>{exam.submitted ? "Submitted" : "Pending"}</td>
                <td>{exam.grade ?? "—"}</td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        onEditExam(exam);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (window.confirm(`Delete ${exam.title}?`)) {
                          onDeleteExam?.(exam.id);
                        }
                      }}
                    >
                      Delete
                    </button>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        const updatedExam = {
                          ...exam,
                          status: exam.status === "Draft" ? "Published" : exam.status === "Published" ? "Closed" : "Draft",
                        };
                        onUpdateExam?.(updatedExam);
                      }}
                    >
                      Change Status
                    </button>

                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => {
                        const updatedExam = {
                          ...exam,
                          examCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
                        };
                        onUpdateExam?.(updatedExam);
                      }}
                    >
                      Generate Code
                    </button>

                    <button className="btn btn-success btn-sm" onClick={() => onViewAnswers(exam)}>
                      Answers / Grade
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TeacherDashboard;
