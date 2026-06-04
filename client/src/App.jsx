import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";

function App() {
  const [rememberMe, setRememberMe] = useState(true);
  const [page, setPage] = useState("login");
  const [role, setRole] = useState("");
  
  if (page === "register") {
  return (
    <RegisterPage
      goToLogin={() => setPage("login")}
    />
  );
}
if (!role) {
  return (
    <RoleSelectionPage
      onSelectRole={setRole}
    />
  );
}
  return (
     <div className="bg-dark min-vh-100 d-flex align-items-center justify-content-center">
    <main className="login-page">
      <section className="login-shell" aria-label="Login form">
        <div className="login-panel">
          <button
            type="button"
            className="btn btn-link p-0 mb-3"
            onClick={() => setRole("")}
          >
            ← Back
            </button>
          <p className="text-uppercase text-primary fw-bold small mb-2">ExamApp</p>
          <h1 className="h3 fw-bold mb-1">Sign in</h1>
          <p className="text-secondary mb-4">Access your exam dashboard.</p>

          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="form-control form-control-lg"
                placeholder="name@example.com"
                autoComplete="email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control form-control-lg"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
              <div className="form-check">
                <input
                  id="remember"
                  type="checkbox"
                  className="form-check-input"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <label htmlFor="remember" className="form-check-label">
                  Remember me
                </label>
              </div>
              <a href="#forgot-password" className="link-primary text-decoration-none">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn btn-primary btn-lg w-100">
              Log in
            </button>

            <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-link"
              onClick={() => setPage("register")}
            >
              Sign Up
            </button>
          </div>
          
          </form>
        </div>
      </section>
    </main>
    </div>
  );
}

export default App;

