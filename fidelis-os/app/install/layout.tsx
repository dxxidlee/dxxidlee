import type { Metadata } from "next";
import { KioskControls } from "@/components/KioskControls";

export const metadata: Metadata = { robots: { index: false } };

/** Fullscreen exhibition mode: no navigation, large type. Click to enter fullscreen. */
export default function InstallLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="kiosk">
      <KioskControls />
      {children}
    </div>
  );
}
