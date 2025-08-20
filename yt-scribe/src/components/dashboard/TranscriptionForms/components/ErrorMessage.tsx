"use client";

import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mt-4 flex items-start gap-2 sm:gap-3 px-3.5 py-3 rounded-xl border bg-red-50/80 border-red-200 text-red-800 shadow-[0_6px_20px_-10px_rgba(220,38,38,0.6)] dark:bg-red-900/20 dark:border-red-800/60 dark:text-red-200"
    >
      <AlertTriangle
        className="h-5 w-5 mt-0.5 text-red-500 drop-shadow-sm"
        aria-hidden="true"
      />
      <p className="text-[0.95rem] leading-relaxed font-medium tracking-wide">
        <span className="bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 bg-clip-text text-transparent">
          {message}
        </span>
      </p>
    </div>
  );
}
