// src/pages/LoginPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const handleGoogleSignIn = () => {
    alert("Google login (demo UI only)");
  };

  return (
    <div className="login-container">

      {/* LEFT TEXT SECTION */}
      <div className="login-left">
        <div className="brand-box">
          <div className="brand-logo">VG</div>
          <div className="brand-info">
            <h2>VyomGarud</h2>
            <p>Cloud Ground Control System</p>
          </div>
        </div>

        <h1 className="hero-text">
          Elevate your <span>drones</span> with real-time telemetry, missions &
          smart fleet management.
        </h1>

        <p className="hero-sub">
          A next-generation control dashboard designed for enterprise-grade drone
          operations.
        </p>
      </div>

      {/* LOGIN CARD */}
      <div className="login-right">
        <div className="login-card">

          <h2 className="card-title">Sign in</h2>
          <p className="card-sub">Access your VyomGarud account</p>

          <button className="google-btn" onClick={handleGoogleSignIn}>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
            />
            Sign in with Google
          </button>

          <div className="divider">
            <span></span> or <span></span>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <label>Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              required
              placeholder="•••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="submit-btn" type="submit">
              Login
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
