import Link from "next/link";

export function SiteFooter() {
  return (
    <div className="vw-bottom">
      <Link className="chip" href="/foundry">
        <span>Foundry</span>
        <span>Manufacture a belief</span>
      </Link>
      <p className="bar">
        <span>Trust, manufactured.</span>
        <span>A Fidelis company</span>
      </p>
    </div>
  );
}
