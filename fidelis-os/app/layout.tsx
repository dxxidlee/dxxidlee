import type { Metadata } from "next";
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
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
