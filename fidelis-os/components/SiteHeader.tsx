"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/foundry", label: "Foundry" },
  { href: "/store", label: "Store" },
  { href: "/holdings", label: "Holdings" },
  { href: "/manual", label: "Trust Manual" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header">
      <Link href="/" className="site-header__name">
        Fidelis OS
      </Link>
      <nav className="site-header__nav" aria-label="Primary">
        <ul>
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
