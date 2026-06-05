function ExamPage({ exam, onBack }) {
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

            {q.type === "multiple" &&
              q.answers?.map(
                (answer, i) => (
                  <div key={i}>
                    <input
                      type="radio"
                      name={`q${q.id}`}
                    />
                    {" "}
                    {answer}
                  </div>
                )
              )}
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
            alert("Exam submitted successfully!");
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