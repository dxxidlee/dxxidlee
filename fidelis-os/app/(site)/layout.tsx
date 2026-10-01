import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

/** The public site: fixed header, content on the unit grid, fixed bottom bar. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="vw">
      <SiteHeader />
      <main className="vw-in">{children}</main>
      <SiteFooter />
    </div>
  );
}
