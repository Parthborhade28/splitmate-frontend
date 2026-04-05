import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserEmail } from "../context/Auth";
import API from "../services/api";

export default function Dashboard() {

  const [trips, setTrips] = useState([]);
  const [tripName, setTripName] = useState("");
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  // 🔥 LOAD USER
  const loadUser = async () => {
    try {
      const email = getUserEmail();

      console.log("EMAIL:", email);

      if (!email) {
        navigate("/login");
        return;
      }

      const res = await API.get("/users/by-email?email=" + email);

      console.log("USER:", res.data);

      if (!res.data || !res.data.id) {
        throw new Error("Invalid user");
      }

      setUserId(res.data.id);

    } catch (err) {
      console.error("User error:", err);
      localStorage.clear();
      navigate("/login");
    }
  };

  // 🔥 FETCH TRIPS
  const fetchTrips = async (uid) => {
    try {
      if (!uid) return;

      const res = await API.get("/trips/my?userId=" + uid);

      console.log("TRIPS:", res.data);

      if (Array.isArray(res.data)) {
        setTrips(res.data);
      } else {
        setTrips([]);
      }

    } catch (err) {
      console.error("Trips error:", err);
      setTrips([]);
    }
  };

  // 🔥 CREATE TRIP
  const createTrip = async () => {
    try {
      if (!tripName.trim()) {
        alert("Enter trip name ❌");
        return;
      }

      if (!userId) {
        alert("User not loaded ❌");
        return;
      }

      console.log("Creating trip for user:", userId);

      await API.post("/trips", {
        name: tripName,
        userId: userId
      });

      alert("Trip created ✅");

      setTripName("");

      fetchTrips(userId);

    } catch (err) {
      console.error("Create error:", err);
      alert("Failed to create trip ❌");
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTrips(userId);
    }
  }, [userId]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <input
        value={tripName}
        onChange={(e) => setTripName(e.target.value)}
        placeholder="Enter trip name"
      />

      <button onClick={createTrip}>Create Trip</button>

      <h2>Your Trips</h2>

      {trips.length === 0 ? (
        <p>No trips found</p>
      ) : (
        trips.map((t) => (
          <div
            key={t.id}
            onClick={() => navigate("/trip/" + t.id)}
            style={{ cursor: "pointer", margin: "10px 0" }}
          >
            {t.name}
          </div>
        ))
      )}
    </div>
  );
}