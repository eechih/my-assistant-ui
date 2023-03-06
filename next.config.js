/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['s3.us-east-1.amazonaws.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination:
          'https://ncqzyp4jb5.execute-api.us-east-1.amazonaws.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig
