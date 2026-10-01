import type { Metadata } from "next";
import "@fontsource/inter-tight/latin-300.css";
import "@fontsource/inter-tight/latin-400.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: { default: "Fidelis OS", template: "%s | Fidelis OS" },
  description: "Trust, manufactured.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="vw">
          <SiteHeader />
          <main className="vw-in">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
