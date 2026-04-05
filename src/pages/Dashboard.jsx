import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getUserEmail } from "../context/Auth";
import API from "../services/api";

const TRIP_EMOJIS = ["🏖","🏔","🌍","🗺","🏕","🚢","🎒","🌴","🗼","🏜"];
const randomEmoji = () => TRIP_EMOJIS[Math.floor(Math.random() * TRIP_EMOJIS.length)];

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [tripName, setTripName] = useState("");
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "ok" });
  const nav = useNavigate();

  const showToast = (message, type = "ok") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const loadUser = async () => {
    try {
      const email = getUserEmail();
      if (!email) { nav("/login"); return; }
      const res = await API.get(`/users/by-email?email=${email}`);
      if (!res.data) throw new Error("Invalid user");
      setUserId(res.data.id);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      nav("/login");
    }
  };

  const fetchTrips = async () => {
    try {
      if (!userId) return;
      const res = await API.get(`/trips/my?userId=${userId}`);
      const data = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
      setTrips(data.filter(t => t?.id));
    } catch (err) {
      console.error(err);
      setTrips([]);
    }
  };

  const createTrip = async () => {
    if (!tripName.trim()) { setError("Trip name is required"); return; }
    try {
      setLoading(true);
      await API.post("/trips", { name: tripName, userId });
      setTripName("");
      setError("");
      await fetchTrips();
      showToast(`"${tripName}" created ✓`, "ok");
    } catch (err) {
      console.error(err);
      showToast("Failed to create trip ✕", "err");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUser(); }, []);
  useEffect(() => { if (userId) fetchTrips(); }, [userId]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

        .db-root { font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; background:#050508; color:#f5f5f7; overflow-x:hidden; }

        .db-grid-bg { position:fixed;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.05) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0; }
        .db-orb { position:fixed;border-radius:50%;pointer-events:none;animation:db-breathe 8s ease-in-out infinite; }
        .db-o1 { width:600px;height:600px;background:radial-gradient(circle,rgba(41,151,255,.13) 0%,transparent 70%);top:-200px;left:-150px; }
        .db-o2 { width:500px;height:500px;background:radial-gradient(circle,rgba(110,60,255,.11) 0%,transparent 70%);bottom:-180px;right:-100px;animation-delay:4s; }
        @keyframes db-breathe{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.08);opacity:.7}}

        .db-nav { position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:0 32px;height:60px;background:rgba(5,5,8,.72);backdrop-filter:blur(24px) saturate(180%);border-bottom:1px solid rgba(255,255,255,.07); }
        .db-nav-logo { display:flex;align-items:center;gap:9px; }
        .db-nav-icon { width:30px;height:30px;background:linear-gradient(135deg,#2997ff,#6060ff);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 0 16px rgba(41,151,255,.35);color:#fff; }
        .db-nav-name { font-size:14px;font-weight:600;letter-spacing:-.01em; }
        .db-nav-right { display:flex;align-items:center;gap:16px; }
        .db-avatar { width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,rgba(41,151,255,.4),rgba(100,60,255,.4));border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;cursor:pointer; }
        .db-logout { font-size:12px;font-weight:500;color:rgba(245,245,247,.5);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);padding:6px 14px;border-radius:8px;cursor:pointer;transition:color .2s,background .2s; }
        .db-logout:hover{color:#f5f5f7;background:rgba(255,255,255,.1);}

        .db-main { position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:48px 32px 80px; }

        .db-header { display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:40px;animation:db-fadeUp .7s .10s cubic-bezier(.16,1,.3,1) both; }
        .db-title { font-family:'Instrument Serif',serif;font-size:40px;font-weight:400;font-style:italic;line-height:1.1; }
        .db-title span { color:#2997ff; }
        .db-count { font-size:13px;color:rgba(245,245,247,.5);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);padding:6px 14px;border-radius:20px; }

        @keyframes db-fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

        .db-create-card { background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.10);border-radius:20px;padding:24px 28px;margin-bottom:36px;backdrop-filter:blur(32px);box-shadow:0 0 0 .5px rgba(255,255,255,.06) inset,0 20px 48px rgba(0,0,0,.35);animation:db-fadeUp .7s .18s cubic-bezier(.16,1,.3,1) both;transition:border-color .3s; }
        .db-create-card:focus-within{border-color:rgba(41,151,255,.35);}
        .db-create-label { font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(245,245,247,.45);margin-bottom:14px;display:flex;align-items:center;gap:8px; }
        .db-create-label::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.07);}
        .db-create-row { display:flex;gap:12px; }
        .db-create-input { flex:1;padding:13px 16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.11);border-radius:12px;color:#f5f5f7;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;outline:none;transition:border-color .25s,box-shadow .25s,background .25s; }
        .db-create-input::placeholder{color:rgba(255,255,255,.18);}
        .db-create-input:focus{border-color:#2997ff;background:rgba(41,151,255,.06);box-shadow:0 0 0 3px rgba(41,151,255,.2);}
        .db-create-btn { padding:13px 24px;background:#2997ff;color:#fff;font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:600;border:none;border-radius:12px;cursor:pointer;white-space:nowrap;transition:transform .18s,box-shadow .18s,background .18s;box-shadow:0 4px 20px rgba(41,151,255,.3); }
        .db-create-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 28px rgba(41,151,255,.45);background:#3aa0ff;}
        .db-create-btn:active:not(:disabled){transform:none;}
        .db-create-btn:disabled{opacity:.4;cursor:not-allowed;}
        .db-create-err { font-size:12px;color:#ff6b6b;margin-top:10px;display:flex;align-items:center;gap:6px; }

        .db-spinner { display:inline-block;width:13px;height:13px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:db-spin .7s linear infinite;vertical-align:middle;margin-right:7px; }
        @keyframes db-spin{to{transform:rotate(360deg)}}

        .db-section-label { font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:rgba(245,245,247,.45);margin-bottom:16px;display:flex;align-items:center;gap:10px;animation:db-fadeUp .7s .22s cubic-bezier(.16,1,.3,1) both; }
        .db-section-label::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.07);}

        .db-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px;animation:db-fadeUp .7s .26s cubic-bezier(.16,1,.3,1) both; }

        .db-trip-card { position:relative;overflow:hidden;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.10);border-radius:20px;padding:24px 24px 20px;cursor:pointer;transition:transform .22s,border-color .22s,box-shadow .22s,background .22s;box-shadow:0 8px 32px rgba(0,0,0,.25); }
        .db-trip-card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 60% 20%,rgba(41,151,255,.08) 0%,transparent 60%);opacity:0;transition:opacity .3s;}
        .db-trip-card:hover{transform:translateY(-4px);border-color:rgba(41,151,255,.35);background:rgba(255,255,255,.07);box-shadow:0 16px 48px rgba(0,0,0,.4),0 0 40px rgba(41,151,255,.08);}
        .db-trip-card:hover::before{opacity:1;}
        .db-card-icon { width:40px;height:40px;border-radius:12px;background:rgba(41,151,255,.15);border:1px solid rgba(41,151,255,.2);display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:16px; }
        .db-card-name { font-size:17px;font-weight:600;margin-bottom:6px;letter-spacing:-.01em; }
        .db-card-sub { font-size:12px;color:rgba(245,245,247,.45);display:flex;align-items:center;gap:5px; }
        .db-card-arrow { position:absolute;right:20px;top:50%;transform:translateY(-50%);font-size:18px;color:rgba(255,255,255,.18);transition:color .2s,transform .2s; }
        .db-trip-card:hover .db-card-arrow{color:#2997ff;transform:translateY(-50%) translateX(4px);}

        .db-empty { grid-column:1/-1;text-align:center;padding:80px 20px;border:1px dashed rgba(255,255,255,.1);border-radius:20px;background:rgba(255,255,255,.02); }
        .db-empty-icon { font-size:48px;margin-bottom:16px;opacity:.6; }
        .db-empty-title { font-family:'Instrument Serif',serif;font-size:24px;font-style:italic;color:rgba(245,245,247,.65);margin-bottom:8px; }
        .db-empty-sub { font-size:13px;color:rgba(245,245,247,.4); }

        .db-toast { position:fixed;top:24px;left:50%;transform:translateX(-50%) translateY(-90px);padding:11px 20px;border-radius:12px;font-size:13px;font-weight:500;backdrop-filter:blur(20px);z-index:999;transition:transform .4s cubic-bezier(.16,1,.3,1);white-space:nowrap;pointer-events:none; }
        .db-toast-err { background:rgba(255,70,70,.12);border:1px solid rgba(255,70,70,.3);color:#ff6b6b; }
        .db-toast-ok  { background:rgba(0,220,120,.12);border:1px solid rgba(0,220,120,.3);color:#34d399; }
        .db-toast-show { transform:translateX(-50%) translateY(0); }

        @media(max-width:600px){
          .db-main{padding:32px 16px 60px;}
          .db-title{font-size:28px;}
          .db-create-row{flex-direction:column;}
          .db-create-btn{width:100%;}
          .db-nav{padding:0 16px;}
        }
      `}</style>

      {/* Toast */}
      <div className={`db-toast db-toast-${toast.type} ${toast.show ? "db-toast-show" : ""}`}>
        {toast.message}
      </div>

      <div className="db-root">
        <div className="db-grid-bg" />
        <div className="db-orb db-o1" />
        <div className="db-orb db-o2" />

        {/* Navbar */}
        <nav className="db-nav">
          <div className="db-nav-logo">
            <div className="db-nav-icon">✦</div>
            <span className="db-nav-name">SplitMates</span>
          </div>
          <div className="db-nav-right">
            <div className="db-avatar">A</div>
            <button className="db-logout" onClick={() => { localStorage.clear(); nav("/login"); }}>
              Sign out
            </button>
          </div>
        </nav>

        <main className="db-main">
          {/* Header */}
          <div className="db-header">
            <div>
              <h1 className="db-title">Your <span>Trips.</span></h1>
            </div>
            <span className="db-count">{trips.length} trip{trips.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Create */}
          <div className="db-create-card">
            <div className="db-create-label">New Trip</div>
            <div className="db-create-row">
              <input
                className="db-create-input"
                placeholder="e.g. Goa 2025, Euro Trip…"
                value={tripName}
                onChange={e => { setTripName(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && createTrip()}
              />
              <button className="db-create-btn" onClick={createTrip} disabled={loading}>
                {loading ? <><span className="db-spinner" />Creating…</> : "+ Create"}
              </button>
            </div>
            {error && <div className="db-create-err">⚠ {error}</div>}
          </div>

          {/* Trips */}
          {trips.length > 0 && <div className="db-section-label">Recent Trips</div>}
          <div className="db-grid">
            {trips.length === 0 ? (
              <div className="db-empty">
                <div className="db-empty-icon">✈️</div>
                <div className="db-empty-title">No trips yet.</div>
                <div className="db-empty-sub">Create your first trip to start splitting expenses.</div>
              </div>
            ) : trips.map((t, i) => (
              <div
                key={t.id}
                className="db-trip-card"
                style={{ animationDelay: `${i * 0.07}s` }}
                onClick={() => nav(`/trip/${t.id}`)}
              >
                <div className="db-card-icon">{randomEmoji()}</div>
                <div className="db-card-name">{t.name}</div>
                <div className="db-card-sub">✦ Tap to manage expenses</div>
                <div className="db-card-arrow">→</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}