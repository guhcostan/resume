"use client";
import { Icon } from "./icons";

export function ThemeToggle() {
  function toggle() {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("gustavo-theme", theme); } catch { /* Theme still works without storage. */ }
  }
  return <button className="theme-toggle" onClick={toggle} type="button" aria-label="Alternar tema claro e escuro"><Icon name="moon" className="moon-icon"/><Icon name="sun" className="sun-icon"/></button>;
}
