import { SiteLayout, localizedMetadata, siteViewport } from "@/components/SiteLayout";
export const metadata = localizedMetadata("pt");
export const viewport = siteViewport;
export default function PortugueseLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout locale="pt">{children}</SiteLayout>;
}
