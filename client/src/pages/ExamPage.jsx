import { useState } from "react";

function ExamPage({
  exam,
  onBack,
  onSubmitExam,
}) {
  const [answers, setAnswers] = useState({});
  
  return (
    <div className="container mt-4">
      <h1>{exam.title}</h1>

      <p>
        Start Date: {exam.startDate}
      </p>

      <hr />

      {exam.questions?.map((q, index) => (
        <div
          key={q.id}
          className="card mb-3"
        >
          <div className="card-body">
            <h5>
              Question {index + 1}
            </h5>

            <p>{q.text}</p>

            {q.type === "open" && (
            <textarea
              className="form-control mt-2"
              placeholder="Write your answer..."
              onChange={(e) =>
                setAnswers({
                  ...answers,
                  [q.id]: e.target.value,
                })
              }
            />
          )}
            {q.type === "multiple" &&
              q.answers?.map(
                (answer, i) => (

                  <div key={i}>
                     <input
                      type="radio"
                      name={`q${q.id}`}
                      onChange={() =>
                        setAnswers({
                          ...answers,
                          [q.id]: answer,
                        })
                      }
                    />
                    {" "}
                    {answer}
                  </div>
                ))}
          </div>
        </div>
      ))}

        <button
        className="btn btn-success me-2"
        onClick={() => {
            const confirmed = window.confirm(
            "Are you sure you want to finish the exam?"
            );

            if (confirmed) {
            onSubmitExam({
            ...exam,
            submissions: [
              ...(exam.submissions || []),
              {
                id: Date.now(),
                submittedAnswers: answers,
                submittedAt: new Date().toLocaleString(),
                grade: null,
              },
            ],
          });
            onBack();
            }
        }}
        >
        Finish Exam
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

export default ExamPage;