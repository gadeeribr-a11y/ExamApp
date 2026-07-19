import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="login-page">
          <section className="login-shell">
            <div className="login-panel">
              <h1 className="h4">Unable to load ExamApp</h1>
              <p>Your saved session may be out of date. Reset it and return to the sign-in page.</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  localStorage.removeItem("authToken");
                  localStorage.removeItem("exams");
                  window.location.reload();
                }}
              >
                Reset and reload
              </button>
            </div>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
);
