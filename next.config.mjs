/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  ...(process.platform === "win32"
    ? {
        experimental: {
          webpackBuildWorker: false,
        },
      }
    : {}),
};

export default nextConfig;

