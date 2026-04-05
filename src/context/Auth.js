import { jwtDecode } from "jwt-decode";

export function getUserEmail() {
  try {
    const token = localStorage.getItem("token");

    if (!token) return null;

    const decoded = jwtDecode(token);

    // 🔥 check if token expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    return decoded.sub; // email

  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}

export function isLoggedIn() {
  return getUserEmail() !== null;
}