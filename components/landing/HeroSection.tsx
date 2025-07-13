'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-xl space-y-6"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          الحصول على التأشيرة لم يعد معقدًا
        </h1>
        <p className="text-gray-600 text-lg">
          SwiftVisa هي منصتك السريعة لتقديم وتتبع طلبات التأشيرة بكل سهولة.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          قدّم طلبك الآن
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="mt-10 md:mt-0"
      >
        <Image
          src="/illustrations/hero.png"
          alt="Visa Illustration"
          width={500}
          height={400}
        />
      </motion.div>
    </section>
  );
}