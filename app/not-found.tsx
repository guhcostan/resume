import Link from "next/link";
import { Arrow } from "@/components/Arrow";
export default function NotFound() {
  return <main className="not-found"><p>404 / página não encontrada</p><h1>Por aqui ainda não tem nada.</h1><p>Mas tem projetos, ideias e um pouco da minha história na página inicial.</p><Link className="button button-primary" href="/">Voltar ao início <Arrow /></Link></main>;
}
