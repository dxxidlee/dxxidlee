import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native SQLite driver must stay out of the bundle.
  serverExternalPackages: ["better-sqlite3"],
  // This app lives inside the portfolio repo; keep Next scoped to this folder.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
