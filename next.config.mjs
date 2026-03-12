/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "icons.llama.fi",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/api/mpc/:path*",
        destination: "/api/mcp/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
