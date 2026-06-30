"use client";

import { useEffect } from "react";

export function useReveal() {
  useEffect(() => {
    const reveal = (el: Element) => el.classList.add("is-visible");
    const nodes = () =>
      Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

    if (!("IntersectionObserver" in window)) {
      nodes().forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );

    nodes().forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) reveal(el);
      else observer.observe(el);
    });

    const fallback = window.setTimeout(() => nodes().forEach(reveal), 3500);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);
}
