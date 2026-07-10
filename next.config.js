/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a self-contained server bundle for Docker/Dokploy deployments.
  output: "standalone",
  experimental: {
    esmExternals: "loose",
  },
};

module.exports = nextConfig;
