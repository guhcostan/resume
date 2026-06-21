"use client";

import { useEffect } from "react";

/**
 * Adds the `is-visible` class to every `.reveal` element as it scrolls into
 * view, powering the lightweight entrance animations defined in globals.css.
 *
 * Designed to be fail-safe: anything already in the viewport is revealed
 * immediately, and a fallback guarantees content is never left permanently
 * hidden if the observer never fires.
 */
export function useReveal() {
  useEffect(() => {
    const reveal = (el: Element) => el.classList.add("is-visible");
    const collect = () =>
      Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

    let els = collect();

    if (!("IntersectionObserver" in window)) {
      els.forEach(reveal);
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
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );

    const observeAll = () => {
      els = collect();
      els.forEach((el) => {
        if (el.classList.contains("is-visible")) return;
        const rect = el.getBoundingClientRect();
        // Reveal immediately if already within the viewport on load.
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          reveal(el);
        } else {
          observer.observe(el);
        }
      });
    };

    observeAll();

    // Safety net: if anything is still hidden after a few seconds (e.g. the
    // observer never fired for some reason), reveal it so content is readable.
    const fallback = window.setTimeout(() => {
      collect().forEach(reveal);
    }, 4000);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);
}
