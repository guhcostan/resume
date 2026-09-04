import { SiteLayout, localizedMetadata, siteViewport } from "@/components/SiteLayout";
export const metadata = localizedMetadata("en");
export const viewport = siteViewport;
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout locale="en">{children}</SiteLayout>;
}
