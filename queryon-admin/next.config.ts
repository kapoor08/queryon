/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/translate",
        destination: "/api/translate",
      },
    ];
  },
};

module.exports = nextConfig;
