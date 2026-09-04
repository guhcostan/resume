"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";

export function CopyEmail() {
  const [message, setMessage] = useState("Copiar e-mail");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setMessage("E-mail copiado!");
    } catch {
      setMessage("Selecione o e-mail para copiar");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage("Copiar e-mail"), 3500);
  }

  return <button className="copy-email" type="button" onClick={copy} aria-live="polite">{message}</button>;
}
