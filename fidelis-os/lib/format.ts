const price = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const count = new Intl.NumberFormat("en-US");
const date = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export const formatPrice = (cents: number) => price.format(cents / 100);
export const formatCount = (n: number) => count.format(n);
export const formatDate = (iso: string) => date.format(new Date(iso));

export const formatBelievers = (n: number) =>
  `${formatCount(n)} ${n === 1 ? "believer" : "believers"}`;
