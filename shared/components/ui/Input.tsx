"use client";

import { FieldError } from "react-hook-form";

export default function Input({
  label,
  type = "text",
  register,
  name,
  error,
  placeholder,
}: {
  label?: string;
  type?: string;
  register: any;
  name: string;
  error?: FieldError;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
          error ? "border-red-400" : ""
        }`}
      />
      {error && <p className="text-xs text-red-600">{String(error.message)}</p>}
    </div>
  );
}
