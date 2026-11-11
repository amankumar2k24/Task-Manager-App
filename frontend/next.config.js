const isDev = process.env.NODE_ENV !== "production";

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    if (!isDev) return [];
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
