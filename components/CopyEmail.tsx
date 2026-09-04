"use client";

import { useEffect, useRef, useState } from "react";
import { dictionaries, type LocalizedProps } from "@/lib/i18n";
import { profile } from "@/lib/content";

export function CopyEmail({ locale }: LocalizedProps) {
  const t = dictionaries[locale].copy;
  const [message, setMessage] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setMessage("copied");
    } catch {
      setMessage("failed");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage("idle"), 3500);
  }

  return <button className="copy-email" type="button" onClick={copy} aria-live="polite">{message === "copied" ? t.emailDone : message === "failed" ? t.emailError : t.email}</button>;
}
