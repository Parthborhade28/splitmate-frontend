import { jwtDecode } from "jwt-decode";

export function getUserEmail() {
  try {
    const token = localStorage.getItem("token");

    if (!token) return null;

    // 🔥 IMPORTANT CHECK (THIS FIXES YOUR BUG)
    if (token.split(".").length !== 3) {
      localStorage.removeItem("token");
      return null;
    }

    const decoded = jwtDecode(token);

    // 🔥 check expiry
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    return decoded.sub;

  } catch (error) {
    console.error("Invalid token", error);
    localStorage.removeItem("token"); // 🔥 cleanup
    return null;
  }
}

export function isLoggedIn() {
  return getUserEmail() !== null;
}