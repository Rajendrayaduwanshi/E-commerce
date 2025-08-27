export async function registerAdmin(data: any) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, role: "admin" }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Registration failed");
  }

  return res.json();
}

import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export async function loginAdmin(data: { email: string; password: string }) {
  const res = await api.post("/auth/login", { ...data, role: "admin" });
  return res.data;
}
