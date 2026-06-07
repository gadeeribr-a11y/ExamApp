import { useState } from "react";

function EditExamPage({
  exam,
  onSave,
  onBack,
}) {

const [questions, setQuestions] =
  useState(exam?.questions || []);


const [questionText, setQuestionText] = useState("");
const [questionType, setQuestionType] = useState("open");
const [answerA, setAnswerA] = useState("");
const [answerB, setAnswerB] = useState("");
const [answerC, setAnswerC] = useState("");
const [answerD, setAnswerD] = useState("");
const [correctAnswer, setCorrectAnswer] = useState("A");

  return (
    <div className="container mt-4">
      <h1>{exam?.title}</h1>
        <div className="mb-3">
        <input
            className="form-control"
            placeholder="Question Text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
        />
        </div>

        <div className="mb-3">
        <select
            className="form-control"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
        >
            <option value="open">Open Question</option>
            <option value="multiple">Multiple Choice</option>
        </select>

        {questionType === "multiple" && (
        <>
            <input
            className="form-control mb-2"
            placeholder="Answer A"
            value={answerA}
            onChange={(e) => setAnswerA(e.target.value)}
            />

            <input
            className="form-control mb-2"
            placeholder="Answer B"
            value={answerB}
            onChange={(e) => setAnswerB(e.target.value)}
            />

            <input
            className="form-control mb-2"
            placeholder="Answer C"
            value={answerC}
            onChange={(e) => setAnswerC(e.target.value)}
            />

            <input
            className="form-control mb-2"
            placeholder="Answer D"
            value={answerD}
            onChange={(e) => setAnswerD(e.target.value)}
            />

            <select
            className="form-control mb-3"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            >
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
            </select>
        </>
        )}

        </div>
      
      <button
        className="btn btn-primary mb-3"
        onClick={() => {
            if (!questionText) return;

            setQuestions([
            ...questions,
            {
            id: Date.now(),
            text: questionText,
            type: questionType,

            answers:
                questionType === "multiple"
                ? [
                    answerA,
                    answerB,
                    answerC,
                    answerD,
                    ]
                : [],

            correctAnswer:
                questionType === "multiple"
                ? correctAnswer
                : null,
            },
            ]);

            setQuestionText("");
            setAnswerA("");
            setAnswerB("");
            setAnswerC("");
            setAnswerD("");
            setCorrectAnswer("A");
        }}
        >
        Add Question
        </button>

      <ul className="list-group-item mb-3">
        {questions.map((q, index) => (
            <div
            key={q.id}
            className="card mb-4 shadow border-0"
            style={{
            borderRadius: "15px"
            }}
            >
            <div className="card-body">
            <strong>
                Question {index + 1}
            </strong>

            <br />

            {q.text}

            {q.type === "multiple" && (
            <div className="mt-2">
                <div>A. {q.answers[0]}</div>
                <div>B. {q.answers[1]}</div>
                <div>C. {q.answers[2]}</div>
                <div>D. {q.answers[3]}</div>

                <strong>
                Correct: {q.correctAnswer}
                </strong>
            </div>
            )}
            <br />

            <small>
                {q.type}
            </small>
              </div>
            </div>
        ))}
        </ul>
    <button
        className="btn btn-success me-2"
        onClick={() => {
            onSave({
            ...exam,
            questions,
            });
        }}
        >
        Save Questions
        </button>
      <button
        className="btn btn-secondary"
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
}

export default EditExamPage;