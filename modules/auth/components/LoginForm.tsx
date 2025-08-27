"use client";

import { useAuth } from "@/context/AuthContext";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Alert from "@/shared/components/ui/Alert";
import { useState } from "react";
import Link from "next/link";

type Props = {
  role: "user" | "admin";
};

export default function LoginForm({ role }: Props) {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    try {
      await login({ email: data.email, password: data.password });
      setSuccess("Logged in successfully");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 font-sans">
      {/* ✅ Alerts in top-right */}
      <div className="absolute top-6 right-6 space-y-2 w-72">
        {error && (
          <Alert type="error" messages={[error]} onClose={() => setError("")} />
        )}
        {success && (
          <Alert
            type="success"
            messages={[success]}
            onClose={() => setSuccess("")}
          />
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900/80 backdrop-blur-lg shadow-2xl border border-gray-700 rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-8 tracking-wide">
          {role === "admin" ? "Admin Login" : "User Login"}
        </h1>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm md:text-base font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">
              {errors.email.message?.toString()}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm md:text-base font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            placeholder="Enter your password"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          />
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">
              {errors.password.message?.toString()}
            </p>
          )}
        </div>

        {/* ✅ Forgot Password - submit ke upar */}
        <div className="text-right mb-4">
          <Link
            href={
              role === "admin"
                ? "/admin/forgot-password"
                : "/user/forgot-password"
            }
            className="text-blue-400 text-sm hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white py-3 rounded-lg disabled:opacity-50 font-semibold text-sm md:text-base"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {/* ✅ Register link - submit ke neeche */}
        <p className="text-gray-400 text-xs md:text-sm text-center mt-5">
          Don’t have an account?{" "}
          <Link
            href={role === "admin" ? "/admin/register" : "/user/register"}
            className="text-blue-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
