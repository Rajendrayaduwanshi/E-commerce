"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Link from "next/link";

import {
  RegisterSchema,
  RegisterFormValues,
} from "@/modules/auth/validation/authSchema";
import { registerAdmin } from "@/modules/auth/services/authApi";

import Input from "@/shared/components/ui/Input";
import Alert from "@/shared/components/ui/Alert";

export default function AdminRegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerAdmin({ ...data, role: "admin" });
      setSuccess("Admin registered successfully!");
      setError(null);
      reset();
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Registration failed"
      );
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md relative"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Admin Register
        </h1>

        {error && <Alert type="error" messages={[error]} />}
        {success && <Alert type="success" messages={[success]} />}

        {/* Name */}
        <Input
          label="Name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          register={register}
          error={errors.name}
          icon={<User size={18} />}
        />

        {/* Email */}
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          register={register}
          error={errors.email}
          icon={<Mail size={18} />}
        />

        {/* Password */}
        <div className="relative mb-4">
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            register={register}
            error={errors.password}
            icon={<Lock size={18} />}
            className="pr-10"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-9 cursor-pointer text-gray-500"
          >
            {showPassword ? (
              <EyeOff size={20} strokeWidth={2} />
            ) : (
              <Eye size={22} strokeWidth={2} />
            )}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-6">
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter your password"
            register={register}
            error={errors.confirmPassword}
            icon={<Lock size={18} />}
            className="pr-10"
          />
          <span
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-9 cursor-pointer text-gray-500"
          >
            {showConfirmPassword ? (
              <EyeOff size={20} strokeWidth={2} />
            ) : (
              <Eye size={20} strokeWidth={2} />
            )}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50 font-semibold transition"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        {/* Footer */}
        <p className="text-gray-600 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/admin/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
