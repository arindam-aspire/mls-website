import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const workspaceRoot = path.resolve(process.cwd(), "..");
const allowedDevOrigins = (
  process.env.NEXT_ALLOWED_DEV_ORIGINS ??
  "192.168.68.120,192.168.68.127,192.168.1.106,192.168.68.129,192.168.68.101,10.26.208.90"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  transpilePackages: ["@abdoun/abdoun-library"],
  allowedDevOrigins,
  experimental: {
    externalDir: true,
  },
  turbopack: {
    root: workspaceRoot,
  },
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
