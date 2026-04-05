import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Profile() {

  const [user, setUser] = useState({});
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show:false, message:"", type:"ok" });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const showToast = (message, type="ok") => {
    setToast({ show:true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show:false })), 3000);
  };

  useEffect(() => {
    if (!userId) navigate("/login");
    else fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await API.get(`/users/${userId}`);
      setUser(res.data);
      setUpiId(res.data.upiId || "");
    } catch (err) {
      console.error(err);
    }
  };

  const updateUpi = async () => {

    if (!upiId.includes("@")) {
      showToast("Invalid UPI ID ✕", "err");
      return;
    }

    try {
      setLoading(true);
      await API.put(`/users/${userId}/upi?upiId=${upiId}`);
      showToast("UPI Updated ✓", "ok");
    } catch {
      showToast("Update failed ✕", "err");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Delete account permanently?")) return;

    try {
      await API.delete("/users/delete");

      localStorage.clear();
      navigate("/login");

    } catch {
      showToast("Delete failed ✕", "err");
    }
  };

  return (
    <>
      <style>{`
        .pf-root { min-height:100vh; background:#050508; color:#f5f5f7; }

        .pf-main { max-width:520px; margin:0 auto; padding:60px 24px; }

        .pf-title {
          font-family:'Instrument Serif',serif;
          font-size:34px;
          font-style:italic;
          text-align:center;
          margin-bottom:30px;
        }

        .pf-card {
          background:rgba(255,255,255,.045);
          border:1px solid rgba(255,255,255,.10);
          border-radius:22px;
          padding:28px;
          backdrop-filter:blur(30px);
          box-shadow:0 20px 50px rgba(0,0,0,.4);
        }

        .pf-avatar {
          width:70px;
          height:70px;
          border-radius:50%;
          background:linear-gradient(135deg,#2997ff,#6060ff);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:24px;
          font-weight:600;
          margin:0 auto 16px;
        }

        .pf-name {
          text-align:center;
          font-size:18px;
          font-weight:600;
        }

        .pf-email {
          text-align:center;
          font-size:12px;
          color:rgba(245,245,247,.5);
          margin-bottom:24px;
        }

        .pf-label {
          font-size:11px;
          letter-spacing:.08em;
          color:rgba(245,245,247,.45);
          margin-bottom:6px;
          text-transform:uppercase;
        }

        .pf-input {
          width:100%;
          padding:12px;
          border-radius:12px;
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.12);
          color:#fff;
          outline:none;
        }

        .pf-input:focus {
          border-color:#2997ff;
          box-shadow:0 0 0 2px rgba(41,151,255,.2);
        }

        .pf-btn {
          width:100%;
          padding:12px;
          margin-top:14px;
          border-radius:12px;
          font-weight:600;
          cursor:pointer;
          transition:.2s;
        }

        .pf-save {
          background:#2997ff;
          color:#fff;
        }

        .pf-save:hover { transform:translateY(-1px); }

        .pf-delete {
          background:rgba(255,70,70,.15);
          border:1px solid rgba(255,70,70,.3);
          color:#ff6b6b;
          margin-top:18px;
        }

        .pf-delete:hover { background:rgba(255,70,70,.25); }

        .pf-toast {
          position:fixed;
          top:20px;
          left:50%;
          transform:translateX(-50%) translateY(-80px);
          padding:10px 20px;
          border-radius:10px;
          transition:.4s;
        }

        .pf-toast-show { transform:translateX(-50%) translateY(0); }
        .pf-toast-ok { background:rgba(0,200,120,.2); }
        .pf-toast-err { background:rgba(255,70,70,.2); }
      `}</style>

      {/* Toast */}
      <div className={`pf-toast pf-toast-${toast.type} ${toast.show ? "pf-toast-show" : ""}`}>
        {toast.message}
      </div>

      <div className="pf-root">

        <Navbar />

        <div className="pf-main">

          <h1 className="pf-title">Profile 👤</h1>

          <div className="pf-card">

            {/* Avatar */}
            <div className="pf-avatar">
              {user.name?.[0]?.toUpperCase()}
            </div>

            <div className="pf-name">{user.name}</div>
            <div className="pf-email">{user.email}</div>

            {/* UPI */}
            <div className="pf-label">UPI ID</div>

            <input
              className="pf-input"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="Enter UPI ID"
            />

            <button
              onClick={updateUpi}
              disabled={loading}
              className="pf-btn pf-save"
            >
              {loading ? "Saving..." : "Save UPI"}
            </button>

            {/* Delete */}
            <button
              onClick={deleteAccount}
              className="pf-btn pf-delete"
            >
              Delete Account ❌
            </button>

          </div>

        </div>
      </div>
    </>
  );
}