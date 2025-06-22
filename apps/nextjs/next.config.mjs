import { env } from "@workspace/env/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@workspace/ui"],
    allowedDevOrigins: [env.CLIENT_DOMAIN].filter(Boolean),
};

export default nextConfig;
