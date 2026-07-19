import { useState } from "react";

function RegisterPage({ goToLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter an email and password.");
      return;
    }

    try {
      await onRegister?.({ email, password, role });
    } catch (registerError) {
      setError(registerError.message || "Registration failed.");
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
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="form-control mb-3"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <select className="form-control mb-3" value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          {error ? <div className="alert alert-danger py-2">{error}</div> : null}

          <button className="btn btn-primary w-100" type="submit">
            Create Account
          </button>
        </form>

        <div className="text-center mt-3">
          <button className="btn btn-link" onClick={goToLogin}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;