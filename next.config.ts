import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** This app directory — not the parent `azure/` folder, which contains other Next apps. */
const projectRoot = path.resolve(__dirname);

const allowedDevOrigins = (
  process.env.NEXT_ALLOWED_DEV_ORIGINS ??
  "192.168.68.120,192.168.68.127,192.168.1.106,192.168.68.129,192.168.68.101,10.26.208.90"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  transpilePackages: ["@abdoun/abdoun-library"],
  // Pin the workspace root to this app. The parent `azure/` folder has other
  // Next.js apps and lockfiles; using it as `turbopack.root` makes `/en` 404
  // because App Router pages under `app/[locale]` are not discovered.
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  webpack: (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.symlinks = false;
    return config;
  },
  allowedDevOrigins,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "abdoun-dev-assets-usw2.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "abdoun-dev-assets-usw2.s3.us-west-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/w40/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
