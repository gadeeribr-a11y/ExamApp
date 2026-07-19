import React, { useEffect, useState } from "react";
import { clearDraft, getDraft, saveDraft } from "../services/DraftService";
import NotificationService from "../services/NotificationService";

function EditExamPage({ exam, onSave, onBack }) {
  const [questions, setQuestions] = useState(exam?.questions || []);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("open");
  const [answerA, setAnswerA] = useState("");
  const [answerB, setAnswerB] = useState("");
  const [answerC, setAnswerC] = useState("");
  const [answerD, setAnswerD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("A");
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const draftKey = `edit-exam-${exam?.id ?? "new"}`;

  useEffect(() => {
    const draft = getDraft(draftKey);

    if (draft) {
      setQuestions(draft.questions || []);
      setQuestionText(draft.questionText || "");
      setQuestionType(draft.questionType || "open");
      setAnswerA(draft.answerA || "");
      setAnswerB(draft.answerB || "");
      setAnswerC(draft.answerC || "");
      setAnswerD(draft.answerD || "");
      setCorrectAnswer(draft.correctAnswer || "A");
      setEditingQuestionId(draft.editingQuestionId || null);
    } else {
      setQuestions(exam?.questions || []);
      setQuestionText("");
      setQuestionType("open");
      setAnswerA("");
      setAnswerB("");
      setAnswerC("");
      setAnswerD("");
      setCorrectAnswer("A");
      setEditingQuestionId(null);
    }
  }, [draftKey, exam?.id]);

  useEffect(() => {
    saveDraft(draftKey, {
      questions,
      questionText,
      questionType,
      answerA,
      answerB,
      answerC,
      answerD,
      correctAnswer,
      editingQuestionId,
    });
  }, [draftKey, questions, questionText, questionType, answerA, answerB, answerC, answerD, correctAnswer, editingQuestionId]);

  const handleSaveQuestion = () => {
    if (!questionText.trim()) {
      NotificationService.notify("Please add question text before saving.", "warning");
      return;
    }

    const question = {
      id: editingQuestionId ?? Date.now(),
      text: questionText,
      type: questionType,
      answers: questionType === "multiple" ? [answerA, answerB, answerC, answerD] : [],
      correctAnswer: questionType === "multiple" ? correctAnswer : null,
    };

    setQuestions((current) => {
      if (editingQuestionId) {
        return current.map((q) => (q.id === editingQuestionId ? question : q));
      }

      return [...current, question];
    });

    setEditingQuestionId(null);
    setQuestionText("");
    setQuestionType("open");
    setAnswerA("");
    setAnswerB("");
    setAnswerC("");
    setAnswerD("");
    setCorrectAnswer("A");
    NotificationService.notify("Question saved to the draft.", "success");
  };

  const handleSaveExam = async () => {
    setIsSaving(true);

    try {
      const saved = await onSave({ ...exam, questions });
      if (saved) {
        clearDraft(draftKey);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>{exam?.title}</h1>
      <p className="text-muted">Changes are auto-saved locally so the draft is preserved.</p>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Question Text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <select className="form-control" value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
          <option value="open">Open Question</option>
          <option value="multiple">Multiple Choice</option>
        </select>

        {questionType === "multiple" && (
          <>
            <input className="form-control mb-2" placeholder="Answer A" value={answerA} onChange={(e) => setAnswerA(e.target.value)} />
            <input className="form-control mb-2" placeholder="Answer B" value={answerB} onChange={(e) => setAnswerB(e.target.value)} />
            <input className="form-control mb-2" placeholder="Answer C" value={answerC} onChange={(e) => setAnswerC(e.target.value)} />
            <input className="form-control mb-2" placeholder="Answer D" value={answerD} onChange={(e) => setAnswerD(e.target.value)} />
            <select className="form-control mb-3" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}>
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>
          </>
        )}
      </div>

      <button className="btn btn-primary mb-3" onClick={handleSaveQuestion}>
        {editingQuestionId ? "Update Question" : "Add Question"}
      </button>

      <ul className="list-group-item mb-3">
        {questions.map((q, index) => (
          <div key={q.id} className="card mb-4 shadow border-0" style={{ borderRadius: "15px" }}>
            <div className="card-body">
              <strong>Question {index + 1}</strong>
              <br />
              {q.text}

              {q.type === "multiple" && (
                <div className="mt-2">
                  <div>A. {q.answers[0]}</div>
                  <div>B. {q.answers[1]}</div>
                  <div>C. {q.answers[2]}</div>
                  <div>D. {q.answers[3]}</div>
                  <strong>Correct: {q.correctAnswer}</strong>
                </div>
              )}
              <br />
              <small>{q.type}</small>

              <div className="mt-3">
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setEditingQuestionId(q.id);
                    setQuestionText(q.text);
                    setQuestionType(q.type);

                    if (q.type === "multiple") {
                      setAnswerA(q.answers[0]);
                      setAnswerB(q.answers[1]);
                      setAnswerC(q.answers[2]);
                      setAnswerD(q.answers[3]);
                      setCorrectAnswer(q.correctAnswer);
                    } else {
                      setAnswerA("");
                      setAnswerB("");
                      setAnswerC("");
                      setAnswerD("");
                    }

                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    if (window.confirm("Delete this question?")) {
                      setQuestions((current) => current.filter((question) => question.id !== q.id));
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </ul>

      <button className="btn btn-success me-2" onClick={handleSaveExam} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Questions"}
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => {
          clearDraft(draftKey);
          onBack();
        }}
      >
        Back
      </button>
    </div>
  );
}

export default EditExamPage;
