import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // This is required to allow the Next.js dev server to be proxied
  // in the Firebase Studio environment.
  allowedDevOrigins: ['https://*.cluster-ejd22kqny5htuv5dfowoyipt52.cloudworkstations.dev'],
};

export default nextConfig;
