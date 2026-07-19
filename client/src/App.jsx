import React, { useEffect, useState } from "react";
import ApiService from "./services/ApiService";
import NotificationService from "./services/NotificationService";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateExamPage from "./pages/CreateExamPage";
import EditExamPage from "./pages/EditExamPage";
import StudentDashboard from "./pages/StudentDashboard";
import StudentResultsPage from "./pages/StudentResultsPage";
import ExamPage from "./pages/ExamPage";
import ViewAnswersPage from "./pages/ViewAnswersPage";
import SubmissionListPage from "./pages/SubmissionListPage";
import ToastContainer from "./components/ToastContainer";

function App() {
  const [rememberMe, setRememberMe] = useState(true);
  const [page, setPage] = useState("login");
  const [role, setRole] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedExam, setSelectedExam] = useState(null);
  const [studentExam, setStudentExam] = useState(null);
  const [studentResults, setStudentResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const safeExams = Array.isArray(exams) ? exams : [];

  useEffect(() => {
    const existingToken = localStorage.getItem("authToken");

    if (existingToken) {
      ApiService.getMe()
        .then((response) => {
          setLoggedIn(true);
          setRole(response.user.role);
          setEmail(response.user.email);
          return loadExams();
        })
        .catch(() => {
          localStorage.removeItem("authToken");
          setLoggedIn(false);
          setRole("");
        });
    }
  }, []);

  useEffect(() => {
    const handleNotify = (event) => {
      const toast = {
        id: Date.now() + Math.random(),
        message: event.detail?.message || "Done",
        type: event.detail?.type || "info",
      };

      setToasts((current) => [...current, toast]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id));
      }, 4000);
    };

    window.addEventListener("examapp:notify", handleNotify);
    return () => window.removeEventListener("examapp:notify", handleNotify);
  }, []);

  async function loadExams() {
    try {
      const data = await ApiService.getExams();
      setExams(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load exams from API", error);
      setExams([]);
      NotificationService.notify("Unable to load exams right now.", "warning");
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setAuthError("");

    try {
      const response = await ApiService.login(email, password);
      localStorage.setItem("authToken", response.token);
      setLoggedIn(true);
      setRole(response.user.role);
      setEmail(response.user.email);
      setCurrentPage("dashboard");
      setPage("login");
      await loadExams();
      NotificationService.notify("Signed in successfully.", "success");
    } catch (error) {
      setAuthError(error.message || "Login failed.");
      NotificationService.notify("Login failed.", "warning");
    }
  }

  async function handleRegister(payload) {
    setAuthError("");

    try {
      const response = await ApiService.register(payload.email, payload.password, payload.role, payload.name);
      localStorage.setItem("authToken", response.token);
      setLoggedIn(true);
      setRole(response.user.role);
      setEmail(response.user.email);
      setCurrentPage("dashboard");
      setPage("login");
      await loadExams();
      NotificationService.notify("Account created successfully.", "success");
    } catch (error) {
      setAuthError(error.message || "Registration failed.");
      NotificationService.notify("Registration failed.", "warning");
      throw error;
    }
  }

  async function handleCreateExam(exam) {
    try {
      const created = await ApiService.createExam(exam);
      setExams((current) => [...current, created]);
      NotificationService.notify("New exam created.", "success");
      setCurrentPage("dashboard");
    } catch (error) {
      NotificationService.notify("Unable to create exam right now.", "warning");
      console.error(error);
    }
  }

  async function handleUpdateExam(updatedExam) {
    try {
      const savedExam = await ApiService.updateExam(updatedExam.id, updatedExam);
      setExams((current) => current.map((exam) => (exam.id === savedExam.id ? savedExam : exam)));
      setSelectedExam(savedExam);
      NotificationService.notify("Exam updated successfully.", "success");
      setCurrentPage("dashboard");
      return true;
    } catch (error) {
      NotificationService.notify("Unable to update the exam.", "warning");
      console.error(error);
      return false;
    }
  }

  async function handleDeleteExam(examId) {
    try {
      await ApiService.deleteExam(examId);
      setExams((current) => current.filter((exam) => exam.id !== examId));
      NotificationService.notify("Exam deleted.", "success");
    } catch (error) {
      NotificationService.notify("Unable to delete the exam.", "warning");
      console.error(error);
    }
  }

  const renderPage = () => {
    if (page === "forgot-password") {
      return <ForgotPasswordPage onBack={() => setPage("login")} onSubmit={(email) => ApiService.requestPasswordReset(email)} />;
    }

    if (currentPage === "submissions") {
      return <SubmissionListPage exams={safeExams} onBack={() => setCurrentPage("dashboard")} onViewAnswers={(exam) => {
        setSelectedExam(exam);
        setCurrentPage("answers");
      }} />;
    }

    if (currentPage === "answers") {
      return (
        <ViewAnswersPage
          exam={selectedExam}
          onBack={() => setCurrentPage("dashboard")}
          onSaveGrade={(updatedExam) => {
            handleUpdateExam(updatedExam);
          }}
        />
      );
    }

    if (page === "register") {
      return <RegisterPage goToLogin={() => setPage("login")} onRegister={handleRegister} />;
    }

    if (!loggedIn) {
      return (
        <div className="bg-dark min-vh-100 d-flex align-items-center justify-content-center">
          <main className="login-page">
            <section className="login-shell" aria-label="Login form">
              <div className="login-panel">
                <p className="text-uppercase text-primary fw-bold small mb-2">ExamApp</p>
                <h1 className="h3 fw-bold mb-1">Sign in</h1>
                <p className="text-secondary mb-4">Access your exam dashboard.</p>

                <form onSubmit={handleLogin}>
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
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
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
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>

                  {authError ? <div className="alert alert-danger py-2">{authError}</div> : null}

                  <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
                    <div className="form-check">
                      <input id="remember" type="checkbox" className="form-check-input" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />
                      <label htmlFor="remember" className="form-check-label">
                        Remember me
                      </label>
                    </div>
                    <button type="button" className="btn btn-link p-0 link-primary text-decoration-none" onClick={() => setPage("forgot-password")}>
                      Forgot password?
                    </button>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-100">
                    Log in
                  </button>

                  <div className="text-center mt-3">
                    <button type="button" className="btn btn-link" onClick={() => setPage("register")}>
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

    if (role === "student") {
      if (currentPage === "student-results") {
        return <StudentResultsPage results={studentResults} onBack={() => setCurrentPage("dashboard")} />;
      }

      if (studentExam) {
        return (
          <ExamPage
            exam={studentExam}
            onBack={() => setStudentExam(null)}
            onSubmitExam={async (answers) => {
              await ApiService.submitExam(studentExam.id, answers);
              setStudentExam(null);
              await loadExams();
              NotificationService.notify("Exam submitted successfully.", "success");
            }}
          />
        );
      }

      return (
        <StudentDashboard
          exams={safeExams.filter((exam) => exam.status === "Published")}
          onViewResults={async () => {
            try {
              const results = await ApiService.getMySubmissions();
              setStudentResults(Array.isArray(results) ? results : []);
              setCurrentPage("student-results");
            } catch (error) {
              NotificationService.notify("Unable to load your results right now.", "warning");
              console.error(error);
            }
          }}
          onJoinExam={(code) => {
            const exam = safeExams.find((entry) => entry.examCode?.toUpperCase() === code.toUpperCase());

            if (!exam) {
              NotificationService.notify("Exam not found.", "warning");
              return;
            }

            if (exam.status === "Draft") {
              NotificationService.notify("This exam is still a draft.", "warning");
              return;
            }

            if (exam.status === "Closed") {
              NotificationService.notify("This exam is closed.", "warning");
              return;
            }

            setStudentExam(exam);
            NotificationService.notify("Exam opened for you.", "success");
          }}
          onLogout={() => {
            localStorage.removeItem("authToken");
            setLoggedIn(false);
            setRole("");
            setStudentExam(null);
            setPage("login");
            NotificationService.notify("You logged out successfully.", "info");
          }}
        />
      );
    }

    if (role === "teacher") {
      if (currentPage === "create") {
        return <CreateExamPage onCancel={() => setCurrentPage("dashboard")} onSave={handleCreateExam} />;
      }

      if (currentPage === "edit") {
        return <EditExamPage exam={selectedExam} onSave={handleUpdateExam} onBack={() => setCurrentPage("dashboard")} />;
      }

      return (
        <TeacherDashboard
          exams={safeExams}
          setExams={setExams}
          onCreateExam={() => setCurrentPage("create")}
          onEditExam={(exam) => {
            setSelectedExam(exam);
            setCurrentPage("edit");
          }}
          onViewAnswers={(exam) => {
            setSelectedExam(exam);
            setCurrentPage("answers");
          }}
          onViewSubmissions={() => setCurrentPage("submissions")}
          onDeleteExam={handleDeleteExam}
          onUpdateExam={handleUpdateExam}
          onLogout={() => {
            localStorage.removeItem("authToken");
            setLoggedIn(false);
            setRole("");
            setCurrentPage("dashboard");
            setPage("login");
            NotificationService.notify("You logged out successfully.", "info");
          }}
        />
      );
    }

    return null;
  };

  return (
    <>
      <ToastContainer toasts={toasts} />
      {renderPage()}
    </>
  );
}

export default App;

