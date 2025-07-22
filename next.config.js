/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  output: 'export' // אם אתה צריך static export
}

module.exports = nextConfig
