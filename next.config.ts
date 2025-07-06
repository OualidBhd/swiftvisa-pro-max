// next.config.ts
const nextConfig = {
  experimental: {
    appDir: true, // ✅ ضروري لأنك تستخدم مجلد app
  },
  reactStrictMode: true, // مفيد للكشف عن مشاكل React
  images: {
    domains: ['res.cloudinary.com'], // ✅ لأن الصور كتتحمّل من Cloudinary
  },
  env: {
    // ✅ فقط المتغيرات العامة لي بغينا نوصلوها للمتصفح
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  },
};

export default nextConfig;