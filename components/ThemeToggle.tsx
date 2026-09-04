"use client";
import { dictionaries, type LocalizedProps } from "@/lib/i18n";
import { Icon } from "./icons";

export function ThemeToggle({ locale }: LocalizedProps) {
  function toggle() {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("gustavo-theme", theme); } catch { /* Theme still works without storage. */ }
  }
  return <button className="theme-toggle" onClick={toggle} type="button" aria-label={dictionaries[locale].common.theme}><Icon name="moon" className="moon-icon"/><Icon name="sun" className="sun-icon"/></button>;
}
