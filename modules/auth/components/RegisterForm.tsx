"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/validations/auth";
import { registerAdmin } from "../services/authApi";
import Alert from "@/shared/components/ui/Alert";

type Props = {
  role: "user" | "admin";
};

export default function RegisterForm({ role }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState<{
    type: "error" | "success";
    messages: string[];
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await registerAdmin(data);

      setAlert({
        type: "success",
        messages: ["Registration successfull Redirecting..."],
      });

      setTimeout(() => router.push("/admin/login"), 2000);
    } catch (err: any) {
      setAlert({ type: "error", messages: [err.message] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {alert && (
        <Alert
          type={alert.type}
          messages={alert.messages}
          onClose={() => setAlert(null)}
        />
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-900/80 backdrop-blue-lg  shadow-2xl border border-gray-700 rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Admin Register
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Name
          </label>
          <input
            {...register("name")}
            type="text"
            placeholder="Enter your full name"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="bolck text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            {...register("email")}
            type="text"
            placeholder="Enter your email"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
            >
              {showPassword ? (
                <EyeOff size={22} strokeWidth={2} />
              ) : (
                <Eye size={22} strokeWidth={2} />
              )}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
            >
              {showConfirmPassword ? (
                <EyeOff size={22} strokeWidth={2} />
              ) : (
                <Eye size={22} strokeWidth={2} />
              )}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white py-2 rounded-lg disabled:opacity-50 font-semibold"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-gray-400 text-xs text-center mt-4">
          Already have an account?{" "}
          <Link href="/admin/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
