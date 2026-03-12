/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/neural-pulse',        // GitHub Pages serves from /neural-pulse/
  assetPrefix: '/neural-pulse/',    // prefix all _next/static/ asset URLs
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
