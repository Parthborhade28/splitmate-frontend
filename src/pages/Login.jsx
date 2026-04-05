import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const nav = useNavigate();

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  const login = async () => {
    if (!email || !password) {
      showToast("Please enter your email and password ✕");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.id);
      nav("/dashboard");
    } catch (err) {
      console.error(err);
      showToast("Invalid credentials ✕");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

        .sm-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          background: #050508;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        .sm-grid-bg {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .sm-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: sm-breathe 7s ease-in-out infinite;
        }
        .sm-orb-1 {
          width: 560px; height: 560px;
          background: radial-gradient(circle, rgba(41,151,255,0.18) 0%, transparent 70%);
          top: -180px; left: -120px;
        }
        .sm-orb-2 {
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(120,80,255,0.14) 0%, transparent 70%);
          bottom: -150px; right: -80px;
          animation-delay: 3.5s;
        }
        .sm-orb-3 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(0,210,160,0.10) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 1.8s;
        }

        @keyframes sm-breathe {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.12); }
        }
        .sm-orb-3 { animation-name: sm-breathe-center; }
        @keyframes sm-breathe-center {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50%       { opacity: 0.7; transform: translate(-50%, -50%) scale(1.12); }
        }

        .sm-card {
          position: relative;
          z-index: 10;
          width: 400px;
          padding: 48px 40px 40px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 28px;
          backdrop-filter: blur(48px) saturate(180%);
          -webkit-backdrop-filter: blur(48px) saturate(180%);
          box-shadow:
            0 0 0 0.5px rgba(255,255,255,0.08) inset,
            0 32px 64px rgba(0,0,0,0.5),
            0 0 80px rgba(41,151,255,0.05);
          animation: sm-cardIn 0.8s cubic-bezier(0.16,1,0.3,1) both;
          transition: border-color 0.4s, box-shadow 0.4s;
        }
        .sm-card:hover {
          border-color: rgba(255,255,255,0.18);
          box-shadow:
            0 0 0 0.5px rgba(255,255,255,0.12) inset,
            0 40px 80px rgba(0,0,0,0.6),
            0 0 100px rgba(41,151,255,0.08);
        }

        @keyframes sm-cardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .sm-logo-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 32px;
          animation: sm-fadeUp 0.7s 0.10s cubic-bezier(0.16,1,0.3,1) both;
        }
        .sm-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #2997ff, #6060ff);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          box-shadow: 0 0 20px rgba(41,151,255,0.4);
          color: white;
        }
        .sm-logo-name {
          font-size: 15px;
          font-weight: 600;
          color: #f5f5f7;
          letter-spacing: -0.01em;
        }

        .sm-headline {
          font-family: 'Instrument Serif', serif;
          font-size: 34px;
          font-weight: 400;
          font-style: italic;
          color: #f5f5f7;
          line-height: 1.15;
          margin-bottom: 6px;
          animation: sm-fadeUp 0.7s 0.18s cubic-bezier(0.16,1,0.3,1) both;
        }
        .sm-subline {
          font-size: 13px;
          color: rgba(245,245,247,0.55);
          margin-bottom: 36px;
          letter-spacing: 0.01em;
          animation: sm-fadeUp 0.7s 0.24s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes sm-fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .sm-field {
          position: relative;
          margin-bottom: 16px;
        }
        .sm-field-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(245,245,247,0.55);
          margin-bottom: 8px;
          transition: color 0.2s;
        }
        .sm-field:focus-within .sm-field-label { color: #2997ff; }

        .sm-input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          color: #f5f5f7;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          -webkit-appearance: none;
        }
        .sm-input::placeholder { color: rgba(255,255,255,0.2); }
        .sm-input:focus {
          border-color: #2997ff;
          background: rgba(41,151,255,0.06);
          box-shadow: 0 0 0 3px rgba(41,151,255,0.25);
        }

        .sm-field-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .sm-forgot {
          font-size: 11px;
          font-weight: 500;
          color: #2997ff;
          text-decoration: none;
          letter-spacing: 0.02em;
          opacity: 0.85;
          transition: opacity 0.2s;
        }
        .sm-forgot:hover { opacity: 1; }

        .sm-divider {
          margin: 24px 0;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: sm-fadeUp 0.7s 0.42s cubic-bezier(0.16,1,0.3,1) both;
        }
        .sm-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }
        .sm-divider-text {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.06em;
        }

        .sm-btn {
          width: 100%;
          padding: 14px;
          background: #2997ff;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          letter-spacing: -0.01em;
          position: relative;
          overflow: hidden;
          transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
          box-shadow: 0 4px 24px rgba(41,151,255,0.35);
          animation: sm-fadeUp 0.7s 0.48s cubic-bezier(0.16,1,0.3,1) both;
        }
        .sm-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(41,151,255,0.5);
          background: #3aa0ff;
        }
        .sm-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 4px 16px rgba(41,151,255,0.3);
        }
        .sm-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .sm-spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: sm-spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes sm-spin { to { transform: rotate(360deg); } }

        .sm-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 13px;
          color: rgba(245,245,247,0.55);
          animation: sm-fadeUp 0.7s 0.54s cubic-bezier(0.16,1,0.3,1) both;
        }
        .sm-footer a {
          color: #2997ff;
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.2s;
        }
        .sm-footer a:hover { opacity: 0.8; }

        .sm-toast {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%) translateY(-100px);
          background: rgba(255,70,70,0.12);
          border: 1px solid rgba(255,70,70,0.3);
          backdrop-filter: blur(20px);
          color: #ff6b6b;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          z-index: 999;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
          white-space: nowrap;
          pointer-events: none;
        }
        .sm-toast.show {
          transform: translateX(-50%) translateY(0);
        }
      `}</style>

      {/* Toast */}
      <div className={`sm-toast ${toast.show ? "show" : ""}`}>
        {toast.message}
      </div>

      <div className="sm-root">
        <div className="sm-grid-bg" />
        <div className="sm-orb sm-orb-1" />
        <div className="sm-orb sm-orb-2" />
        <div className="sm-orb sm-orb-3" />

        <div className="sm-card">
          {/* Logo */}
          <div className="sm-logo-row">
            <div className="sm-logo-icon">✦</div>
            <span className="sm-logo-name">SplitMates</span>
          </div>

          {/* Headline */}
          <h1 className="sm-headline">Welcome<br />back.</h1>
          <p className="sm-subline">Sign in to continue splitting smarter.</p>

          {/* Email */}
          <div className="sm-field" style={{ animation: "sm-fadeUp 0.7s 0.30s cubic-bezier(0.16,1,0.3,1) both" }}>
            <label className="sm-field-label" htmlFor="sm-email">Email</label>
            <input
              id="sm-email"
              className="sm-input"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
          </div>

          {/* Password */}
          <div className="sm-field" style={{ animation: "sm-fadeUp 0.7s 0.36s cubic-bezier(0.16,1,0.3,1) both" }}>
            <div className="sm-field-row">
              <label className="sm-field-label" style={{ marginBottom: 0 }} htmlFor="sm-password">
                Password
              </label>
              <a href="#" className="sm-forgot">Forgot?</a>
            </div>
            <div style={{ marginTop: 8 }}>
              <input
                id="sm-password"
                className="sm-input"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="sm-divider">
            <div className="sm-divider-line" />
            <span className="sm-divider-text">or</span>
            <div className="sm-divider-line" />
          </div>

          {/* Submit */}
          <button className="sm-btn" onClick={login} disabled={loading}>
            {loading ? (
              <><span className="sm-spinner" />Signing in…</>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Footer */}
          <p className="sm-footer">
            No account yet?{" "}
            <Link to="/register">Create one →</Link>
          </p>
        </div>
      </div>
    </>
  );
}