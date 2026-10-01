/** The Fidelis wordmark (white artwork) in a black box. Size follows the font size of its parent. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no optimization needed */}
      <img src="/fidelis-vw-logo.svg" alt="Fidelis OS" />
    </span>
  );
}
