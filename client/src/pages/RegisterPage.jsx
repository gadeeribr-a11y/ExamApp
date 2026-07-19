import React, { useState } from "react";

function RegisterPage({ goToLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      setError("Please enter an email and password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onRegister?.({ email: normalizedEmail, password, role });
    } catch (registerError) {
      setError(registerError.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-dark min-vh-100 d-flex align-items-center justify-content-center">
      <div className="login-panel">
        <p className="text-uppercase text-primary fw-bold small mb-2">ExamApp</p>
        <h1 className="h3 fw-bold mb-3">Register</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="form-control mb-3"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="form-control mb-3"
            value={password}
            minLength="8"
            required
            onChange={(event) => setPassword(event.target.value)}
          />

          <select className="form-control mb-3" value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          {error ? <div className="alert alert-danger py-2">{error}</div> : null}

          <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-3">
          <button type="button" className="btn btn-link" onClick={goToLogin}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
