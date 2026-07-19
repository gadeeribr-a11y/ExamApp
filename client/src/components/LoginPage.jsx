import React from "react";

function LoginPage() {
  return (
    <div className="container mt-5">
      <div className="card p-4">
        <h2 className="mb-3">Login</h2>

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
        />

        <button className="btn btn-primary">
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
