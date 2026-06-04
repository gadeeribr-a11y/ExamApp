function RegisterPage({ goToLogin }) {
  return (
    <div className="bg-dark min-vh-100 d-flex align-items-center justify-content-center">
      <div className="login-panel">
        <p className="text-uppercase text-primary fw-bold small mb-2">
          ExamApp
        </p>

        <h1 className="h3 fw-bold mb-3">Register</h1>

        <input
          type="text"
          placeholder="Full Name"
          className="form-control mb-3"
        />

        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          className="form-control mb-3"
        />

        <button className="btn btn-primary w-100">
          Create Account
        </button>

        <div className="text-center mt-3">
          <button
            className="btn btn-link"
            onClick={goToLogin}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;