import React, { useState } from "react";
import { finishTripApi } from "../api/tripApi";

const FinishTripButton = ({ tripId }) => {
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleFinishTrip = async () => {
    try {
      setLoading(true);
      const message = await finishTripApi(tripId);
      alert(message); // "Trip finished and emails sent!"
      setFinished(true);
    } catch (error) {
      alert("Error finishing trip");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleFinishTrip}
        disabled={loading || finished}
        style={{
          backgroundColor: finished ? "gray" : "#28a745",
          color: "white",
          padding: "12px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {loading ? "Finishing Trip..." : finished ? "Trip Finished ✅" : "Finish Trip"}
      </button>
    </div>
  );
};

export default FinishTripButton;
