import React, { useEffect, useState } from "react";
import { clearDraft, getDraft, saveDraft } from "../services/DraftService";
import NotificationService from "../services/NotificationService";

function CreateExamPage({ onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("Draft");

  useEffect(() => {
    const draft = getDraft("create-exam");

    if (draft) {
      setTitle(draft.title || "");
      setStartDate(draft.startDate || "");
      setStatus(draft.status || "Draft");
    }
  }, []);

  useEffect(() => {
    saveDraft("create-exam", { title, startDate, status });
  }, [title, startDate, status]);

  const handleSave = () => {
    if (!title.trim()) {
      NotificationService.notify("Please add an exam title before saving.", "warning");
      return;
    }

    const newExam = {
      id: Date.now(),
      examCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      title,
      startDate,
      status,
      questions: [],
      submitted: false,
      submittedAnswers: [],
      grade: null,
    };

    clearDraft("create-exam");
    NotificationService.notify("Exam draft saved successfully.", "success");
    onSave?.(newExam);
    onCancel?.();
  };

  return (
    <div className="container mt-4">
      <h1>Create Exam</h1>
      <p className="text-muted">Your draft is automatically saved locally while you work.</p>

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

      <button className="btn btn-success me-2" onClick={handleSave}>
        Save
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => {
          clearDraft("create-exam");
          onCancel?.();
        }}
      >
        Cancel
      </button>
    </div>
  );
}

export default CreateExamPage;
