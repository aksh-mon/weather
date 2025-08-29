"use client";
import { motion } from "framer-motion";

export default function Title() {
  return (
    <div className="flex justify-center items-center h-screen bg-black ash">
      <motion.h2
        className="relative text-5xl font-extrabold tracking-wide"
        style={{
          background: "linear-gradient(270deg, #111, #333, #555, #111)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%"],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        weatherORwhether
        {/* Tail glow on hover */}
        <span className="absolute inset-0 text-transparent hover:text-white transition-all duration-500 before:content-[''] before:absolute before:-inset-1 before:rounded-lg before:bg-gradient-to-r before:from-gray-800 before:via-gray-600 before:to-gray-900 before:blur-xl before:opacity-0 hover:before:opacity-80" />
      </motion.h2>
    </div>
  );
}
