import { useState } from "react";

function StudentDashboard({
  onJoinExam,
  onLogout,
}) {
  const [code, setCode] = useState("");

  return (
    <div className="container mt-5">
      <h1>Student Dashboard</h1>
      <button
        className="btn btn-outline-danger float-end"
        onClick={onLogout}
      >
        Logout
      </button>
      <input
        className="form-control mb-3"
        placeholder="Enter Exam Code"
        value={code}
        onChange={(e) =>
          setCode(e.target.value)
        }
      />

      <button
        className="btn btn-primary"
        onClick={() => onJoinExam(code)}
      >
        Join Exam
      </button>
    </div>
  );
}

export default StudentDashboard;