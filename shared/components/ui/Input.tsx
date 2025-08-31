"use client";

import { FieldError, UseFormRegister, Path } from "react-hook-form";

type InputProps<T extends Record<string, any>> = {
  label?: string;
  type?: string;
  register: UseFormRegister<T>;
  name: Path<T>;
  error?: FieldError;
  placeholder?: string;
};

export default function Input<T extends Record<string, any>>({
  label,
  type = "text",
  register,
  name,
  error,
  placeholder,
}: InputProps<T>) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={String(name)}
          className="text-sm font-medium text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={`${String(name)}-error`}
        {...register(name)}
        type={type}
        placeholder={placeholder ?? (label ? `Enter ${label}` : "")}
        aria-invalid={!!error}
        aria-describedby={error ? `${String(name)}-error` : undefined}
        className={`border rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors duration-200 ${
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-700 focus:ring-blue-500"
        }`}
      />
      {error && (
        <p id={`&{String(name)}-error`} className="text-xs text-red-600 mt-1">
          {String(error.message)}
        </p>
      )}
    </div>
  );
}
