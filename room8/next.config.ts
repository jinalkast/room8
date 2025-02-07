import { hostname } from "os";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
      },
      {
        hostname: "widrqfeliprozqqknues.supabase.co",
        protocol: "https",
      }
    ],
  },
};

export default nextConfig;
