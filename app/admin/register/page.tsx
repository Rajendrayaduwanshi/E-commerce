"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AdminRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    message: string[];
  } | null>(null);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (alert) {
      setProgress(100);
      let duration = 4000; // 4 sec
      let step = 100 / (duration / 50);
      const interval = setInterval(() => {
        setProgress((prev) => Math.max(prev - step, 0));
      }, 50);

      const timer = setTimeout(() => {
        setAlert(null);
        clearInterval(interval);
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [alert]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      const errorMessages = validation.error.issues.map(
        (issue) => issue.message
      );
      setAlert({ type: "error", message: errorMessages });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "admin" }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setAlert({
          type: "error",
          message: [errData.message || "Registration failed"],
        });
        return;
      }

      setAlert({
        type: "success",
        message: ["Registration successful! Redirecting..."],
      });
      setTimeout(() => router.push("/admin/login"), 2000);
    } catch {
      setAlert({ type: "error", message: ["Server error. Please try again."] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100">
      {/* 🔹 Popup (Top-Right) with Multiple Messages */}
      {alert && (
        <div
          className={`fixed top-5 right-5 w-72 rounded-lg shadow-lg border p-4 
          ${
            alert.type === "error"
              ? "bg-red-50 border-red-300 text-red-700"
              : "bg-green-50 border-green-300 text-green-700"
          }`}
        >
          {alert.message.map((msg, idx) => (
            <p key={idx} className="text-sm">
              {msg}
            </p>
          ))}
          {/* Progress Bar */}
          <div className="mt-2 h-1 bg-gray-200 rounded overflow-hidden">
            <div
              style={{ width: `${progress}%` }}
              className={`h-full transition-all duration-50 ease-linear 
              ${alert.type === "error" ? "bg-red-400" : "bg-green-400"}`}
            ></div>
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6">Admin Register</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
