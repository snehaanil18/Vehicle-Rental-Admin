/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'minio',
            port: '9000',
            pathname: '/vehicles/**',
          },
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '9000',
            pathname: '/vehicles/**',
          },
        ],
      },
};

export default nextConfig;
