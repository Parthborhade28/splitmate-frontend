import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      if (!email) {
        nav("/login");
        return;
      }

      const res = await API.get("/users/by-email?email=" + email);

      if (!res.data || !res.data.id) {
        throw new Error("Invalid user");
      }

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

      const res = await API.get("/trips/my?userId=" + userId);

      console.log("Trips API:", res.data);

      const data = Array.isArray(res.data) ? res.data : [];

      setTrips(data.filter(t => t && t.id));

    } catch (err) {
      console.error(err);
      setTrips([]);
    }
  };

  const createTrip = async () => {
    if (!tripName.trim()) {
      setError("Trip name is required");
      return;
    }

    try {
      setLoading(true);

      await API.post("/trips", {
        name: tripName,
        userId: userId
      });

      const name = tripName;

      setTripName("");
      setError("");

      await fetchTrips();

      showToast(name + " created ✓", "ok");

    } catch (err) {
      console.error(err);
      showToast("Failed to create trip ✕", "err");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (userId) fetchTrips();
  }, [userId]);

  return (
    <>
      <style>{`
        .db-root {
          font-family:sans-serif;
          min-height:100vh;
          background:#050508;
          color:#f5f5f7;
        }

        .db-main {
          max-width:1100px;
          margin:0 auto;
          padding:48px 32px;
        }

        .db-input {
          padding:12px;
          border-radius:10px;
          border:1px solid #333;
          background:#111;
          color:#fff;
          width:100%;
        }

        .db-btn {
          padding:12px 20px;
          background:#2997ff;
          border:none;
          border-radius:10px;
          color:#fff;
          cursor:pointer;
        }

        .db-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(250px,1fr));
          gap:15px;
          margin-top:30px;
        }

        .db-card {
          padding:20px;
          background:#111;
          border-radius:15px;
          cursor:pointer;
        }
      `}</style>

      <div className="db-root">
        <main className="db-main">

          <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
            Your Trips
          </h1>

          <div style={{ display: "flex", gap: "10px" }}>
            <input
              className="db-input"
              value={tripName}
              onChange={(e) => {
                setTripName(e.target.value);
                setError("");
              }}
              placeholder="Enter trip name"
            />

            <button
              className="db-btn"
              onClick={createTrip}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div className="db-grid">
            {trips.length === 0 ? (
              <p>No trips yet</p>
            ) : (
              trips.map((t) => (
                <div
                  key={t.id}
                  className="db-card"
                  onClick={() => nav("/trip/" + t.id)}
                >
                  {randomEmoji()} {t.name}
                </div>
              ))
            )}
          </div>

        </main>
      </div>
    </>
  );
}