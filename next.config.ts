const nextConfig = {
  reactStrictMode: true, // مفيد للكشف عن مشاكل React
  images: {
    domains: ['res.cloudinary.com'], // ✅ لأن الصور كتتحمّل من Cloudinary
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  },
  typescript: {
    // هاد الخيار كيخلي Next.js يتجاهل أخطاء TypeScript أثناء build
    ignoreBuildErrors: true,
  },
  eslint: {
    // هاد الخيار كيتجاهل حتى أخطاء ESLint أثناء build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;