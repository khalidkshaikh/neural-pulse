/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isProd ? '/neural-pulse' : '',
  assetPrefix: isProd ? '/neural-pulse/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
