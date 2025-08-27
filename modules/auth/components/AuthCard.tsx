"use client";

import React from "react";

export default function AuthCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="max-w-md w-full mx-auto p-6 border rounded-lg shadow-sm bg-white">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      <div className="space-y-4">{children}</div>
    </div>
  );
}
