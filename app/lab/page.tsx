import type { Metadata } from "next";
import { LabPageClient } from "@/app/lab/LabPageClient";

export const metadata: Metadata = {
  title: "Lab — Gustavo Costa",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  return <LabPageClient />;
}
