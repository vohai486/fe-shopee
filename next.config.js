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
};

module.exports = nextConfig;
