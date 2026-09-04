import { pt } from "./pt";
import { en } from "./en";

export type Locale = "pt" | "en";
export type LocalizedProps = { locale: Locale };
export const dictionaries = { pt, en };
export const localePath = (locale: Locale) => locale === "en" ? "/en/" : "/";
export const interpolate = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match));
