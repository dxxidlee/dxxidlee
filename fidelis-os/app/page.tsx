import Link from "next/link";

const LAYERS = [
  {
    href: "/foundry",
    label: "Make",
    name: "Foundry",
    description: "State what you need to believe. Fidelis will manufacture it.",
  },
  {
    href: "/store",
    label: "Sell",
    name: "Storefront",
    description: "Every belief Fidelis has made, available to the public.",
  },
  {
    href: "/holdings",
    label: "Hold",
    name: "Holdings",
    description: "The portfolio. Every subsidiary, ranked by believers.",
  },
];

export default function Home() {
  return (
    <section className="landing">
      <h1 className="landing__title">Trust, manufactured.</h1>
      <ul className="landing__layers">
        {LAYERS.map((layer) => (
          <li key={layer.href}>
            <p className="label">{layer.label}</p>
            <h2>
              <Link href={layer.href}>{layer.name}</Link>
            </h2>
            <p>{layer.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
