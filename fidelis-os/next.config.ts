import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native SQLite bindings (used for the local file database) stay out of the bundle.
  serverExternalPackages: ["@libsql/client", "libsql"],
  // This app lives inside the portfolio repo; keep Next scoped to this folder.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
