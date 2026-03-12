/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // static HTML export for GitHub Pages
  trailingSlash: true,       // needed for GH Pages routing
  images: {
    unoptimized: true,       // no Next.js image server on static hosts
  },
};

export default nextConfig;
