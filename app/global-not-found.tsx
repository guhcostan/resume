import { asset } from "@/lib/content";
import "@fontsource-variable/manrope";
import "@fontsource-variable/bricolage-grotesque";
import "./globals.css";

export const metadata = { title: "404 — guh.", robots: { index: false, follow: false } };
export default function GlobalNotFound() {
  return <html lang="en"><body><main className="not-found"><p>404</p><h1>Page not found.</h1><p lang="pt-BR">Essa página não existe. Volte ao início para conhecer meu trabalho.</p><p>Head back to the portfolio to explore my work.</p><div className="not-found-links"><a className="button button-primary" href={asset("/")} lang="pt-BR">Início · PT</a><a className="button button-secondary" href={asset("/en/")} lang="en">Home · EN</a></div></main></body></html>;
}
