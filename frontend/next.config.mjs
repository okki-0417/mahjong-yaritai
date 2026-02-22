/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_API_URL],
  },
};

export default nextConfig;
