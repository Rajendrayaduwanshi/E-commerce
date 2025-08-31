import axios from "axios";

const api = axios.create({ 
  baseURL: "/api",
  headers: {"Content-Type": "application/json" },
});

type AuthResponse = {
  user: {
    id: string;
    email: string;
    role: "user" | "admin";
  };
  accessToken: string;
};

// ----------------------
// Register Admin
// ----------------------
export async function registerAdmin(data: { email: string; password: string}) {
  try {
    const res = await api.post<AuthResponse>("/auth/register", {
      ...data,
      role: "admin",
  });
  return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Registration faild");
  }
}

// ----------------------
// Login Admin
// ----------------------
export async function loginAdmin(data: { email: string; password: string }) {
  try {
      const res = await api.post("/auth/login", { ...data, role: "admin" });
  return res.data;
  }
}
