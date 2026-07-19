import React from "react";

function ToastContainer({ toasts }) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card toast-${toast.type}`}>
          <strong>{toast.type === "success" ? "Success" : toast.type === "warning" ? "Notice" : "Info"}</strong>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
