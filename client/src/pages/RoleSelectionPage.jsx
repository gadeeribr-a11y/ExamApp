import React from "react";

function RoleSelectionPage({ onSelectRole }) {
  return (
    <div className="bg-dark min-vh-100 d-flex justify-content-center align-items-center">
      <div className="login-panel text-center">
        <p className="text-uppercase text-primary fw-bold small mb-2">
          Welcome To ExamApp
        </p>

        <h1 className="h3 fw-bold mb-3">
          Choose Your Role
        </h1>

        <p className="text-secondary mb-4">
          Select how you want to continue
        </p>

        <button
          className="btn btn-primary btn-lg w-100 mb-3"
          onClick={() => onSelectRole("teacher")}
        >
          👨‍🏫 Teacher
        </button>

        <button
          className="btn btn-success btn-lg w-100"
          onClick={() => onSelectRole("student")}
        >
          👨‍🎓 Student
        </button>
      </div>
    </div>
  );
}

export default RoleSelectionPage;
