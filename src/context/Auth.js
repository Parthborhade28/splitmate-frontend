import { jwtDecode } from "jwt-decode";

export function getUserEmail() {
  const token = localStorage.getItem("token");

  // 🔥 NO TOKEN → SAFE EXIT
  if (!token) return null;

  try {
    // 🔥 VALID JWT CHECK
    if (token.split(".").length !== 3) {
      localStorage.removeItem("token");
      return null;
    }

    const decoded = jwtDecode(token);

    // 🔥 EXP CHECK
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    return decoded.sub;

  } catch (error) {
    console.error("Invalid token", error);
    localStorage.removeItem("token");
    return null;
  }
}

export function isLoggedIn() {
  return getUserEmail() !== null;
}