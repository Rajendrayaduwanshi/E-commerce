"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type AlertProps = {
  type: "error" | "success";
  messages?: string[];
  children?: React.ReactNode;
  onClose?: () => void;
  duration?: number;
};

export default function Alert({
  type,
  messages,
  children,
  onClose,
  duration = 3000,
}: AlertProps) {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      className={`p-3 rounded border ${
        type === "error"
          ? "bg-red-50 border-red-300 text-red-700"
          : "bg-green-50 border-green-300 text-green-700"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-1">
          {messages?.map((msg, idx) => (
            <p key={idx} className="text-sm">
              {msg}
            </p>
          ))}

          {children && <p className="text-sm">{children}</p>}
        </div>

        {onClose && (
          <button onClick={onClose}>
            <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      {onClose && (
        <div className="mt-2 h-1 bg-gray-200 rounded overflow-hidden">
          <div
            className={`h-full ${
              type === "error" ? "bg-red-400" : "bg-green-400"
            }`}
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          ></div>
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
