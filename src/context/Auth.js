import { jwtDecode } from "jwt-decode";

export function getUserEmail() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    if (token.split(".").length !== 3) {
      localStorage.removeItem("token");
      return null;
    }

    const decoded = jwtDecode(token);

    console.log("DECODED TOKEN:", decoded); // 🔥 DEBUG

    return decoded.sub || null; // ✅ FIX

  } catch (error) {
    console.error("Invalid token", error);
    localStorage.removeItem("token");
    return null;
  }
}