import Link from "next/link";
import { Intro } from "@/components/Intro";
import { pad } from "@/lib/pad";

const LAYERS = [
  { href: "/foundry", name: "Foundry", verb: "Make" },
  { href: "/store", name: "Store", verb: "Sell" },
  { href: "/holdings", name: "Holdings", verb: "Hold" },
];

export default function Home() {
  return (
    <Intro
      title="Trust, manufactured."
      lead="Fidelis is a holding company whose product is belief. State a desire. Fidelis manufactures a belief to meet it, sells it back to you, and adds it to the portfolio."
      side={
        <>
          <ul className="bars">
            {LAYERS.map((layer, i) => (
              <li key={layer.href}>
                <Link className="bar" href={layer.href}>
                  <span>
                    <span className="no">{pad(i + 1)}</span>
                    {layer.name}
                  </span>
                  <span>{layer.verb}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link className="chip go" href="/foundry">
            <span>Manufacture a belief</span>
            <span>+</span>
          </Link>
        </>
      }
    />
  );
}
