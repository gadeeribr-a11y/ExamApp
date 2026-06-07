import { useState } from "react";

function CreateExamPage({ onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("Draft");

  return (
    <div className="container mt-4">
      <h1>Create Exam</h1>

      <input
        className="form-control mb-3"
        placeholder="Exam Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="date"
        className="form-control mb-3"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <select
        className="form-control mb-3"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option>Draft</option>
        <option>Published</option>
        <option>Closed</option>
      </select>

      <button
        className="btn btn-success me-2"
        onClick={() =>
          onSave({
            id: Date.now(),

            examCode: Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase(),

            title,
            startDate,
            status,
            questions: [],
            submitted: false,
            submittedAnswers: [],
            grade: null,
            })
        }
      >
        Save
      </button>

      <button
        className="btn btn-secondary"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
}

export default CreateExamPage;