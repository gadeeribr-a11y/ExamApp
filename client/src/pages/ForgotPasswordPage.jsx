import React, { useState } from "react";

function ForgotPasswordPage({ onSubmit, onBack }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      setIsSubmitting(true);
      const response = await onSubmit(email.trim().toLowerCase());
      setMessage(response.message || "Password reset email has been sent.");
    } catch (requestError) {
      setError(requestError.message || "Unable to send the reset email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-panel">
          <p className="text-uppercase text-primary fw-bold small mb-2">ExamApp</p>
          <h1 className="h3 fw-bold mb-2">Reset password</h1>
          <p className="text-secondary mb-4">Enter your account email and we’ll send a reset link.</p>
          <form onSubmit={handleSubmit}>
            <input type="email" className="form-control mb-3" placeholder="name@example.com" value={email} required onChange={(event) => setEmail(event.target.value)} />
            {message ? <div className="alert alert-success py-2">{message}</div> : null}
            {error ? <div className="alert alert-danger py-2">{error}</div> : null}
            <button className="btn btn-primary w-100" disabled={isSubmitting} type="submit">{isSubmitting ? "Sending..." : "Send reset email"}</button>
          </form>
          <button className="btn btn-link w-100 mt-3" type="button" onClick={onBack}>Back to sign in</button>
        </div>
      </section>
    </main>
  );
}

export default ForgotPasswordPage;
