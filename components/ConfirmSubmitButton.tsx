"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function ConfirmSubmitButton({
  children,
  message,
  className = "btn-secondary",
  pendingText = "Memproses...",
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  message: string;
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <div className="fixed inset-0 z-[190] grid place-items-center bg-ink/25 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-[2rem] border border-white/80 bg-white p-6 text-center shadow-glow">
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-mint/20 border-t-mint" />
            <h2 className="mt-4 text-2xl font-black">Mohon tunggu...</h2>
            <p className="mt-2 text-sm font-semibold text-ink/60">{pendingText || "Sistem sedang memproses data."}</p>
          </div>
        </div>
      ) : null}
      <button
        className={className}
        disabled={pending || disabled}
        type="submit"
        {...props}
        onClick={(event) => {
          props.onClick?.(event);
          if (event.defaultPrevented) return;
          if (!window.confirm(message)) event.preventDefault();
        }}
      >
        <span className="inline-flex items-center justify-center gap-2">
          {pending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /> : null}
          {pending ? pendingText : children}
        </span>
      </button>
    </>
  );
}
