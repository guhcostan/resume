"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLocale } from "@/components/LanguageProvider";
import { AiTerminal } from "@/components/AiTerminal";
import { SparklesIcon } from "@/components/icons";

type AiTerminalDrawerContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const AiTerminalDrawerContext = createContext<AiTerminalDrawerContextValue | null>(null);

export function AiTerminalDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <AiTerminalDrawerContext.Provider value={{ isOpen, open, close }}>
      {children}
      <AiTerminalDrawer />
    </AiTerminalDrawerContext.Provider>
  );
}

export function useAiTerminalDrawer() {
  const context = useContext(AiTerminalDrawerContext);
  if (!context) {
    throw new Error("useAiTerminalDrawer must be used inside AiTerminalDrawerProvider");
  }
  return context;
}

function AiTerminalDrawer() {
  const { isOpen, close } = useAiTerminalDrawer();
  const { locale } = useLocale();

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close, isOpen]);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-[70] bg-[#171411]/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label={locale === "pt" ? "Terminal IA" : "AI Terminal"}
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 right-0 z-[80] flex w-full max-w-[760px] flex-col border-l border-[#3a322a] bg-[#1e1e1e] text-slate-100 shadow-2xl shadow-black/30 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-12 shrink-0 items-center border-b border-[#3a322a] bg-[#252526] px-3 font-mono text-[11px]">
          <div className="mr-3 flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex h-full items-end gap-1">
            <div className="flex h-9 items-center gap-2 border-x border-t border-[#3a322a] bg-[#1e1e1e] px-3 text-slate-100">
              <SparklesIcon className="h-3.5 w-3.5 text-[#f0b8a0]" />
              <span>ai-terminal</span>
            </div>
            <div className="hidden h-9 items-center px-3 text-slate-500 sm:flex">profile.md</div>
          </div>
          <div className="ml-auto flex items-center gap-3 text-[10px] text-slate-500">
            <span className="hidden sm:inline">LOCAL WORKSPACE</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-label="online" />
            <button
              type="button"
              onClick={close}
              aria-label={locale === "pt" ? "Fechar terminal" : "Close terminal"}
              className="flex h-7 w-7 items-center justify-center rounded text-lg leading-none text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-3 sm:p-5">
          <div className="mb-3 flex items-center justify-between px-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
            <span>{locale === "pt" ? "assistente" : "assistant"}</span>
            <span>esc {locale === "pt" ? "para fechar" : "to close"}</span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {isOpen && (
              <AiTerminal autoPreload autoFocusInput className="max-w-none rounded-lg shadow-none" />
            )}
          </div>
        </div>

        <div className="flex h-7 shrink-0 items-center justify-between border-t border-[#3a322a] bg-[#007acc] px-3 font-mono text-[10px] text-white/90">
          <span>main*</span>
          <span>{locale === "pt" ? "IA local · seguro" : "local AI · secure"}</span>
        </div>
      </aside>
    </>
  );
}
