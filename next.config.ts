import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const workspaceRoot = path.resolve(process.cwd(), "..");

const nextConfig: NextConfig = {
  transpilePackages: ["@abdoun/abdoun-library"],
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
