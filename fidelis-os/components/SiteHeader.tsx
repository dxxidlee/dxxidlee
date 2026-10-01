"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/foundry", label: "Foundry" },
  { href: "/store", label: "Store" },
  { href: "/holdings", label: "Holdings" },
  { href: "/manual", label: "Manual" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="vw-top">
      <Link href="/" className="vw-logo" aria-label="Fidelis OS, home">
        <Logo />
      </Link>
      <nav className="seg" aria-label="Site">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isCurrent(item.href) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
