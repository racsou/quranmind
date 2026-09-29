/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/workspace',
        destination: '/dashboard',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
