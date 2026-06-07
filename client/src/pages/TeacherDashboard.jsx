import { useState } from "react";
import MockDBService from "../services/MockDBService";

function TeacherDashboard({
  exams,
  setExams,
  onCreateExam,
  onEditExam,
  onViewAnswers,
  onLogout,
}) {


  return (
    <div className="container mt-4">
      <h1>Teacher Dashboard</h1>
      <button
      className="btn btn-outline-danger float-end"
      onClick={onLogout}
      >
      Logout
      </button>
      <button
        className="btn btn-primary mb-3"
        onClick={onCreateExam}
      >
        Create Exam
      </button>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>Code</th>
            <th>Actions</th>
            <th>Submitted</th>
            <th>Grade</th>
          </tr>
        </thead>

        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id}>
              <td>{exam.title}</td>
              <td>{exam.status}</td>
              <td>{exam.startDate}</td>
              <td><code>{exam.examCode}</code></td>
              <th>Grade</th>
              <td>
              {exam.submitted
                ? "Submitted"
                : "Not Submitted"}
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => onEditExam(exam)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => {
                  const updated = exams.filter(
                    (e) => e.id !== exam.id
                  );

                  setExams(updated);
                  MockDBService.saveExams(updated);
                  }}
                >
                  Delete
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                  const updated = exams.map((e) =>
                    e.id === exam.id
                      ? {
                          ...e,
                          status:
                            e.status === "Draft"
                              ? "Published"
                              : e.status === "Published"
                              ? "Closed"
                              : "Draft",
                        }
                      : e
                  );

                  setExams(updated);
                  MockDBService.saveExams(updated);

                  }}
                >
                  Change Status
                </button>

                <button
                  className="btn btn-info btn-sm ms-2"
                  onClick={() => {
                    const updated = exams.map((e) =>
                      e.id === exam.id
                        ? {
                            ...e,
                            examCode: Math.random()
                              .toString(36)
                              .substring(2, 8)
                              .toUpperCase(),
                          }
                        : e
                    );

                    setExams(updated);
                    MockDBService.saveExams(updated);
                  }}
                >
                  Generate Code
                </button>

                <button
                  className="btn btn-success btn-sm ms-2"
                  onClick={() => onViewAnswers(exam)}
                >
                  Answers / Grade
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherDashboard;