/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  async redirects() {
    return [
      { source: "/demonstracao", destination: "/signup", permanent: true },
      { source: "/planos", destination: "/precos", permanent: true },
    ];
  },
};

export default nextConfig;
