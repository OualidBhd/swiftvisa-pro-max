"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import heroImg from "@/public/illustrations/hero-visa.png";

const services = [
  { title: "Visa Applications", desc: "ابدأ طلب التأشيرة بسهولة وسرعة.", icon: "/icons/apply.svg" },
  { title: "Tracking", desc: "تتبع حالة طلبك في أي وقت.", icon: "/icons/track.svg" },
  { title: "Support", desc: "فريقنا ديما هنا يعاونك.", icon: "/icons/support.svg" },
];

const testimonials = [
  { name: "Ahmed", feedback: "خدمة رائعة وسريعة جدًا!" },
  { name: "Fatima", feedback: "ساعدوني في كل خطوة، شكراً لكم!" },
];

function Testimonial({ name, feedback }: { name: string; feedback: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-lg shadow-lg text-center border border-blue-100 hover:shadow-2xl transition duration-300"
    >
      <p className="text-blue-800 font-semibold">{name}</p>
      <p className="text-blue-600 mt-2 italic">{feedback}</p>
    </motion.div>
  );
}

function ContactForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-b from-blue-50 to-white p-6 rounded-xl shadow-md max-w-md mx-auto border border-blue-100">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Contact Us</h2>
      <input
        type="text"
        placeholder="Your Name"
        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <input
        type="email"
        placeholder="Your Email"
        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <textarea
        placeholder="Your Message"
        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={4}
        required
      ></textarea>
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Send Message
      </button>
      {message && <p className="text-green-600 mt-3">{message}</p>}
    </form>
  );
}

function Navbar() {
  return (
    <header className="bg-white/90 backdrop-blur-md shadow-md py-4 fixed top-0 w-full z-50">
      <nav className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
          SwiftVisa
        </h1>
        <ul className="flex space-x-6">
          <li><a href="#services" className="hover:text-blue-600 transition-colors">Services</a></li>
          <li><a href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonials</a></li>
          <li><a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-28 max-w-6xl mx-auto">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mt-12 md:mt-0"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 bg-clip-text text-transparent mb-6">
            SwiftVisa: طريقك السهل للتأشيرة
          </h1>
          <p className="text-blue-600 mb-8 text-lg">
            قدم طلبك، تتبعه، وتواصل معانا من مكان واحد.
          </p>
          <Link
            href="/apply"
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Apply Now
          </Link>
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-10 md:mt-0"
        >
          <Image
            src={heroImg}
            alt="Visa Illustration"
            width={420}
            height={320}
            priority
            className="drop-shadow-lg"
          />
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5, scale: 1.03 }}
              className="bg-gradient-to-b from-blue-50 to-white p-6 rounded-xl shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow"
            >
              <Image
                src={service.icon}
                alt={`${service.title} Icon`}
                width={64}
                height={64}
              />
              <h3 className="text-xl font-semibold text-blue-800 mt-4">
                {service.title}
              </h3>
              <p className="text-blue-600 mt-2">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-blue-50">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent text-center mb-8">
          Testimonials
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} name={testimonial.name} feedback={testimonial.feedback} />
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <ContactForm />
      </section>

      {/* Footer Section */}
      <footer className="py-6 bg-blue-100 text-center text-blue-700">
        <p>© {new Date().getFullYear()} SwiftVisa. All rights reserved.</p>
        <p className="mt-2">
          Contact us at:{" "}
          <a href="mailto:support@swiftvisa.com" className="text-blue-800 underline">
            support@swiftvisa.com
          </a>
        </p>
      </footer>
    </main>
  );
}