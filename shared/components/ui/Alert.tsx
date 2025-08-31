"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AlertProps = {
  type: "error" | "success";
  messages: string[];
  onClose?: () => void;
};

export default function Alert({ type, messages, onClose }: AlertProps) {
  // Auto-close after 3s
  useEffect(() => {
    if (!onClose) return;
    const timer = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {messages.length > 0 && (
        <motion.div
          role="alert"
          aria-live={type === "error" ? "assertive" : "polite"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0, y: -0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className={`p-3 rounded border shdaw-md ${
            type === "error"
              ? "bg-red-50 border-red-300 text-red-700"
              : "bg-green-50 border-green-300 text-green-700"
          }`}
        >
          <div className="flex justify-between items-start">
            {/* Messages */}
            <div className="flex-1 space-y-1">
              {messages.map((msg, idx) => (
                <p key={idx} className="text-sm">
                  {msg}
                </p>
              ))}
            </div>

            {/* Close button */}
            {onClose && (
              <button onClick={onClose} aria-label="Close alert">
                <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
