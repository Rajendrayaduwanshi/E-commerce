// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.role !== "admin") {
          router.push("/admin/login");
        } else {
          setLoading(false);
        }
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Welcome to Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Manage products, orders, and users here.
      </p>
    </div>
  );
}
