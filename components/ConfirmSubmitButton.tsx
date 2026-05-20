"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function ConfirmSubmitButton({
  children,
  message,
  className = "btn-secondary",
  pendingText = "Memproses..."
}: {
  children: ReactNode;
  message: string;
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      className={className}
      disabled={pending}
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {pending ? pendingText : children}
    </button>
  );
}
