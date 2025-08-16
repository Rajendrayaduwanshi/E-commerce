import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-center text-2xl font-bold mb-4 text-gray-800">
          Admin Panel
        </h1>
        {children}
      </div>
    </div>
  );
}
