import { useState } from "react";

function StudentDashboard({
  exams,
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
      <hr className="my-4" />

<h3>My Grades</h3>

{exams
  .filter(
    (exam) =>
      exam.grade !== null &&
      exam.grade !== undefined
  )
  .map((exam) => (
    <div
      key={exam.id}
      className="card mb-3"
    >
      <div className="card-body">
        <h5>{exam.title}</h5>

        <p>
          <strong>Code:</strong>{" "}
          {exam.examCode}
        </p>

        <p>
          <strong>Grade:</strong>{" "}
          {exam.grade}
        </p>
      </div>
    </div>
  ))}
    </div>
  );
}

export default StudentDashboard;