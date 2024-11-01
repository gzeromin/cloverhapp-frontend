/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3003/api/:path*',
        // 'http://ec2-3-38-181-60.ap-northeast-2.compute.amazonaws.com:3003/api/:path*',
      },
    ];
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'elasticbeanstalk-us-east-1-149536466661.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'elasticbeanstalk-us-east-1-149536466661.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'search1.kakaocdn.net',
      },
    ],
  },
};

export default nextConfig;
