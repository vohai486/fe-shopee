/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "shopee.vn",
      "down-vn.img.susercontent.com",
      "plus.unsplash.com",
      "salt.tikicdn.com",
      "res.cloudinary.com",
      "firebasestorage.googleapis.com",
    ],
  },
  async redirects() {
    return [
      {
        source: "/seller",
        destination: "/seller/dashboard",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
