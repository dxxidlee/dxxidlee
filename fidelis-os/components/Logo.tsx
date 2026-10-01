/** The Fidelis mark (black artwork, transparent background). Size follows the font size of its parent. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no optimization needed */}
      <img src="/fidelis-favicon.svg" alt="Fidelis OS" />
    </span>
  );
}
