import type { Metadata } from "next";
import { LabView } from "@/app/lab/LabView";

// Hidden page: not linked anywhere and kept out of search indexes.
export const metadata: Metadata = {
  title: "Lab — Gustavo Costa",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  return <LabView />;
}
