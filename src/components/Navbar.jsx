import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

        .nb-nav {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px; height: 62px;
          background: rgba(5,5,8,.75);
          backdrop-filter: blur(28px) saturate(200%);
          -webkit-backdrop-filter: blur(28px) saturate(200%);
          border-bottom: 1px solid rgba(255,255,255,.08);
          box-shadow: 0 1px 0 rgba(255,255,255,.04);
          font-family: 'Plus Jakarta Sans', sans-serif;
          animation: nb-slideDown .6s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes nb-slideDown {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:none; }
        }

        .nb-left  { display:flex; align-items:center; gap:12px; }
        .nb-right { display:flex; align-items:center; gap:8px; }

        .nb-back {
          display:flex; align-items:center; justify-content:center;
          width:34px; height:34px; border-radius:10px;
          background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.09);
          color:#f5f5f7; font-size:15px; cursor:pointer;
          transition:background .2s, border-color .2s, transform .18s;
        }
        .nb-back:hover {
          background:rgba(255,255,255,.12);
          border-color:rgba(255,255,255,.16);
          transform:translateX(-2px);
        }

        .nb-sep { width:1px; height:20px; background:rgba(255,255,255,.1); margin:0 2px; }

        .nb-logo {
          display:flex; align-items:center; gap:9px;
          cursor:pointer; text-decoration:none;
        }
        .nb-logo-icon {
          width:30px; height:30px;
          background:linear-gradient(135deg,#2997ff,#6060ff);
          border-radius:8px; display:flex; align-items:center; justify-content:center;
          font-size:13px; color:#fff;
          box-shadow:0 0 14px rgba(41,151,255,.35);
          transition:transform .2s, box-shadow .2s;
        }
        .nb-logo:hover .nb-logo-icon {
          transform:scale(1.08);
          box-shadow:0 0 22px rgba(41,151,255,.5);
        }
        .nb-logo-name { font-size:14px; font-weight:600; letter-spacing:-.01em; color:#f5f5f7; }
        .nb-logo-dot  { color:#2997ff; }

        .nb-link {
          display:flex; align-items:center; gap:6px;
          padding:7px 13px; border-radius:9px;
          font-size:13px; font-weight:500;
          color:rgba(245,245,247,.55);
          background:transparent; border:none; cursor:pointer;
          transition:color .2s, background .2s;
        }
        .nb-link:hover  { color:#f5f5f7; background:rgba(255,255,255,.07); }
        .nb-link.active { color:#2997ff; background:rgba(41,151,255,.1); }
        .nb-link-icon   { font-size:14px; opacity:.75; }

        .nb-signout {
          display:flex; align-items:center; gap:6px;
          padding:7px 14px; border-radius:9px;
          font-size:13px; font-weight:500;
          color:rgba(245,245,247,.55);
          background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.09);
          cursor:pointer;
          transition:color .2s, background .2s, border-color .2s;
        }
        .nb-signout:hover {
          color:#ff6b6b;
          background:rgba(255,70,70,.1);
          border-color:rgba(255,70,70,.25);
        }

        @media(max-width:600px) {
          .nb-nav    { padding:0 16px; }
          .nb-link-icon { display:none; }
          .nb-link   { padding:7px 10px; }
          .nb-signout{ padding:7px 10px; }
        }
      `}</style>

      <nav className="nb-nav">
        {/* Left */}
        <div className="nb-left">
          <button className="nb-back" onClick={() => nav(-1)} title="Go back">←</button>
          <div className="nb-sep" />
          <div className="nb-logo" onClick={() => nav("/dashboard")}>
            <div className="nb-logo-icon">✦</div>
            <span className="nb-logo-name">
              Split<span className="nb-logo-dot">Mates</span>
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="nb-right">
          <button
            className={`nb-link ${isActive("/history") ? "active" : ""}`}
            onClick={() => nav("/history")}
          >
            <span className="nb-link-icon">🕓</span> History
          </button>
          <button
            className={`nb-link ${isActive("/profile") ? "active" : ""}`}
            onClick={() => nav("/profile")}
          >
            <span className="nb-link-icon">👤</span> Profile
          </button>
          <div className="nb-sep" />
          <button className="nb-signout" onClick={logout}>
            <span>↩</span> Sign out
          </button>
        </div>
      </nav>
    </>
  );
}