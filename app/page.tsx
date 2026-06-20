"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { OpenSource } from "@/components/sections/OpenSource";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { useReveal } from "@/components/useReveal";
import { useLocale } from "@/components/LanguageProvider";

export default function Home() {
  // Re-run reveal observers when the locale changes (content re-renders).
  const { locale } = useLocale();
  useReveal();

  return (
    <div key={locale}>
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <OpenSource />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
