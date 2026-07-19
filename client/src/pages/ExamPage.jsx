import React, { useEffect, useRef, useState } from "react";
import NotificationService from "../services/NotificationService";

function ExamPage({
  exam,
  onBack,
  onSubmitExam,
}) {
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState((Number(exam.durationMinutes) || 30) * 60);
  const answersRef = useRef(answers);
  const submittedRef = useRef(false);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const submitExam = async (automatic = false) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setIsSubmitting(true);
    try {
      await onSubmitExam(answersRef.current);
      if (automatic) {
        NotificationService.notify("Time is up. Your exam was submitted automatically.", "info");
      }
    } catch (error) {
      submittedRef.current = false;
      NotificationService.notify("Unable to submit the exam. Please try again.", "warning");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          submitExam(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = String(secondsRemaining % 60).padStart(2, "0");
  
  return (
    <div className="container mt-4">
      <h1>{exam.title}</h1>

      <p>
        Start Date: {exam.startDate}
      </p>
      <p className="fw-bold text-danger">Time remaining: {minutes}:{seconds}</p>

      <hr />

      {exam.questions?.length === 0 ? <div className="alert alert-warning">This exam does not have any questions yet.</div> : null}

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
        disabled={isSubmitting}
        onClick={async () => {
            const confirmed = window.confirm(
            "Are you sure you want to finish the exam?"
            );

            if (confirmed) {
            await submitExam();
            }
        }}
        >
        {isSubmitting ? "Submitting..." : "Finish Exam"}
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
