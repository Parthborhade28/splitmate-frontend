import API from "../services/api";

export const finishTripApi = async (tripId) => {
  const response = await API.post(`/trips/finish/${tripId}`);
  return response.data;
};
