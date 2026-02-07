// src/services/auth.ts

const API_URL = "http://localhost:8000/api/v1/auth";

// ----------------------
// TOKEN HELPERS
// ----------------------

export const AuthToken = {
  get() {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("token");
  },

  set(token: string) {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("token", token);
  },

  remove() {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("token");
  },

  isAuthenticated() {
    return !!this.get();
  },
};

// ----------------------
// AUTH API ACTIONS
// ----------------------

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Invalid email or password");

  const data = await res.json();
  AuthToken.set(data.access_token);

  return data;
}

export async function registerUser(payload: any) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Registration failed");

  return await res.json();
}

export function logout() {
  AuthToken.remove();
}