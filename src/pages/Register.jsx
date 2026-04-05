import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [strength, setStrength] = useState(0);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const nav = useNavigate();

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3200);
  };

  const checkStrength = (pw) => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw) || /\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw) && pw.length >= 8) score++;
    setStrength(score);
  };

  const strengthColors = ["#ff4444", "#ff8800", "#2997ff", "#34d399"];
  const strengthColor = strength > 0 ? strengthColors[strength - 1] : null;

  const register = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast("Please fill in all required fields ✕");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters ✕");
      return;
    }
    try {
      setLoading(true);
      await API.post("/auth/register", { name, email, password, upiId });
      showToast("Registered successfully! Redirecting… ✓", "success");
      setTimeout(() => nav("/login"), 1500);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Registration failed ✕");
    } finally {
      setLoading(false);
    }
  };

  const dot2Active = name && email;
  const dot3Active = strength >= 3;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

        .sr-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          background: #050508;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; position: relative;
        }
        .sr-grid {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px);
          background-size: 40px 40px; pointer-events: none;
        }
        .sr-orb { position: absolute; border-radius: 50%; pointer-events: none; animation: sr-breathe 7s ease-in-out infinite; }
        .sr-orb-1 { width:520px;height:520px; background:radial-gradient(circle,rgba(41,151,255,.16) 0%,transparent 70%); top:-160px;left:-100px; }
        .sr-orb-2 { width:460px;height:460px; background:radial-gradient(circle,rgba(100,60,255,.13) 0%,transparent 70%); bottom:-140px;right:-80px; animation-delay:3.5s; }
        .sr-orb-3 { width:300px;height:300px; background:radial-gradient(circle,rgba(0,220,150,.09) 0%,transparent 70%); top:55%;left:55%; animation-delay:1.8s; }
        @keyframes sr-breathe { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:.7} }

        .sr-card {
          position:relative;z-index:10;width:420px;
          padding:44px 40px 38px;
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.10);
          border-radius:28px;
          backdrop-filter:blur(48px) saturate(180%);
          -webkit-backdrop-filter:blur(48px) saturate(180%);
          box-shadow:0 0 0 .5px rgba(255,255,255,.08) inset,0 32px 64px rgba(0,0,0,.5);
          animation:sr-cardIn .8s cubic-bezier(.16,1,.3,1) both;
          transition:border-color .4s,box-shadow .4s;
        }
        .sr-card:hover { border-color:rgba(255,255,255,.17); }
        @keyframes sr-cardIn { from{opacity:0;transform:translateY(28px) scale(.97)} to{opacity:1;transform:none} }

        .sr-logo-row { display:flex;align-items:center;gap:10px;margin-bottom:24px; animation:sr-fadeUp .7s .08s cubic-bezier(.16,1,.3,1) both; }
        .sr-logo-icon { width:36px;height:36px;background:linear-gradient(135deg,#2997ff,#6060ff);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;color:#fff;box-shadow:0 0 20px rgba(41,151,255,.4); }
        .sr-logo-name { font-size:15px;font-weight:600;color:#f5f5f7;letter-spacing:-.01em; }

        .sr-dots { display:flex;gap:6px;justify-content:center;margin-bottom:24px; animation:sr-fadeUp .7s .06s cubic-bezier(.16,1,.3,1) both; }
        .sr-dot { width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.15);transition:background .3s,transform .3s; }
        .sr-dot.active { background:#2997ff;transform:scale(1.4); }

        .sr-headline { font-family:'Instrument Serif',serif;font-size:32px;font-weight:400;font-style:italic;color:#f5f5f7;line-height:1.15;margin-bottom:5px; animation:sr-fadeUp .7s .16s cubic-bezier(.16,1,.3,1) both; }
        .sr-subline { font-size:13px;color:rgba(245,245,247,.52);margin-bottom:28px;letter-spacing:.01em; animation:sr-fadeUp .7s .22s cubic-bezier(.16,1,.3,1) both; }

        @keyframes sr-fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }

        .sr-grid-fields { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
        .sr-full { grid-column:1/-1; }
        .sr-fields-wrap { display:flex;flex-direction:column;gap:14px; animation:sr-fadeUp .7s .28s cubic-bezier(.16,1,.3,1) both; }

        .sr-field { position:relative; }
        .sr-label { display:block;font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(245,245,247,.5);margin-bottom:7px;transition:color .2s; }
        .sr-field:focus-within .sr-label { color:#2997ff; }
        .sr-upi-row { display:flex;align-items:center;gap:8px;margin-bottom:7px; }
        .sr-badge { font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(41,151,255,.8);background:rgba(41,151,255,.12);border:1px solid rgba(41,151,255,.2);border-radius:5px;padding:2px 7px; }

        .sr-input { width:100%;padding:12px 14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.11);border-radius:11px;color:#f5f5f7;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;outline:none;transition:border-color .25s,box-shadow .25s,background .25s;-webkit-appearance:none; }
        .sr-input::placeholder{color:rgba(255,255,255,.18);}
        .sr-input:focus{border-color:#2997ff;background:rgba(41,151,255,.06);box-shadow:0 0 0 3px rgba(41,151,255,.22);}

        .sr-strength { display:flex;gap:4px;margin-top:7px; }
        .sr-seg { flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.08);transition:background .35s; }

        .sr-btn { margin-top:22px;width:100%;padding:14px;background:#2997ff;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:15px;font-weight:600;border:none;border-radius:12px;cursor:pointer;letter-spacing:-.01em;transition:transform .18s,box-shadow .18s,background .18s;box-shadow:0 4px 24px rgba(41,151,255,.32); animation:sr-fadeUp .7s .48s cubic-bezier(.16,1,.3,1) both; }
        .sr-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 32px rgba(41,151,255,.48);background:#3aa0ff;}
        .sr-btn:active:not(:disabled){transform:none;}
        .sr-btn:disabled{opacity:.45;cursor:not-allowed;}

        .sr-spinner { display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:sr-spin .7s linear infinite;vertical-align:middle;margin-right:8px; }
        @keyframes sr-spin{to{transform:rotate(360deg)}}

        .sr-footer { margin-top:22px;text-align:center;font-size:13px;color:rgba(245,245,247,.52); animation:sr-fadeUp .7s .54s cubic-bezier(.16,1,.3,1) both; }
        .sr-footer a{color:#2997ff;text-decoration:none;font-weight:500;transition:opacity .2s;}
        .sr-footer a:hover{opacity:.8;}

        .sr-toast { position:fixed;top:24px;left:50%;transform:translateX(-50%) translateY(-90px);padding:11px 20px;border-radius:12px;font-size:13px;font-weight:500;backdrop-filter:blur(20px);z-index:999;transition:transform .4s cubic-bezier(.16,1,.3,1);white-space:nowrap;pointer-events:none; }
        .sr-toast-error{background:rgba(255,70,70,.12);border:1px solid rgba(255,70,70,.3);color:#ff6b6b;}
        .sr-toast-success{background:rgba(0,220,120,.12);border:1px solid rgba(0,220,120,.3);color:#34d399;}
        .sr-toast-show{transform:translateX(-50%) translateY(0);}
      `}</style>

      {/* Toast */}
      <div className={`sr-toast sr-toast-${toast.type} ${toast.show ? "sr-toast-show" : ""}`}>
        {toast.message}
      </div>

      <div className="sr-root">
        <div className="sr-grid" />
        <div className="sr-orb sr-orb-1" />
        <div className="sr-orb sr-orb-2" />
        <div className="sr-orb sr-orb-3" />

        <div className="sr-card">
          <div className="sr-logo-row">
            <div className="sr-logo-icon">✦</div>
            <span className="sr-logo-name">SplitMates</span>
          </div>

          {/* Progress dots */}
          <div className="sr-dots">
            <div className="sr-dot active" />
            <div className={`sr-dot ${dot2Active ? "active" : ""}`} />
            <div className={`sr-dot ${dot3Active ? "active" : ""}`} />
          </div>

          <h1 className="sr-headline">Create your<br />account.</h1>
          <p className="sr-subline">Start splitting expenses with your squad.</p>

          <form onSubmit={register}>
            <div className="sr-fields-wrap">
              <div className="sr-grid-fields">

                {/* Name */}
                <div className="sr-field">
                  <label className="sr-label">Full Name</label>
                  <input className="sr-input" type="text" placeholder="Alex Kumar"
                    value={name} onChange={e => setName(e.target.value)} />
                </div>

                {/* Email */}
                <div className="sr-field">
                  <label className="sr-label">Email</label>
                  <input className="sr-input" type="email" placeholder="you@gmail.com"
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                {/* UPI */}
                <div className="sr-field sr-full">
                  <div className="sr-upi-row">
                    <label className="sr-label" style={{ marginBottom: 0 }}>UPI ID</label>
                    <span className="sr-badge">Optional</span>
                  </div>
                  <input className="sr-input" type="text" placeholder="yourname@upi"
                    value={upiId} onChange={e => setUpiId(e.target.value)} />
                </div>

                {/* Password */}
                <div className="sr-field sr-full">
                  <label className="sr-label">Password</label>
                  <input className="sr-input" type="password" placeholder="Min. 6 characters"
                    value={password}
                    onChange={e => { setPassword(e.target.value); checkStrength(e.target.value); }} />
                  {/* Strength bar */}
                  <div className="sr-strength">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="sr-seg"
                        style={{ background: i < strength ? strengthColor : undefined }} />
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <button type="submit" className="sr-btn" disabled={loading}>
              {loading ? <><span className="sr-spinner" />Creating account…</> : "Create Account"}
            </button>
          </form>

          <p className="sr-footer">
            Already have an account? <Link to="/login">Sign in →</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;