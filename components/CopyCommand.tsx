"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

const command = "npx mac-cleaner-cli scan";

export function CopyCommand() {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy() {
    try { await navigator.clipboard.writeText(command); setMessage("Comando copiado"); }
    catch { setMessage("Selecione o comando para copiar"); }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 3000);
  }
  return <div className="command-line"><span aria-hidden="true" className="command-dollar">$</span><code>{command}</code><button type="button" onClick={copy} aria-label={message || "Copiar comando de verificação"}><Icon name={message === "Comando copiado" ? "check" : "copy"} /></button><span className="sr-only" role="status">{message}</span></div>;
}
