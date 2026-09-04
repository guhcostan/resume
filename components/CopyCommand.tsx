"use client";
import { useEffect, useRef, useState } from "react";
import { dictionaries, type LocalizedProps } from "@/lib/i18n";
import { Icon } from "./icons";

const command = "npx mac-cleaner-cli scan";

export function CopyCommand({ locale }: LocalizedProps) {
  const t = dictionaries[locale].copy;
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const message = state === "copied" ? t.commandDone : state === "failed" ? t.commandError : "";
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy() {
    try { await navigator.clipboard.writeText(command); setState("copied"); }
    catch { setState("failed"); }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 3000);
  }
  return <div className="command-line"><span aria-hidden="true" className="command-dollar">$</span><code>{command}</code><button type="button" onClick={copy} aria-label={message || t.command}><Icon name={state === "copied" ? "check" : "copy"} /></button><span className="sr-only" role="status">{message}</span></div>;
}
