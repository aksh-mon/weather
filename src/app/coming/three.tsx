"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function TornadoButtonPage() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-sky-200 via-sky-400 to-sky-600 transition-all duration-700">
      {/* Page Title */}
      <motion.h1
        className="text-5xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
        animate={{ backgroundPosition: hovered ? "200% center" : "0% center" }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        Stunning Dummy Title
      </motion.h1>

      {/* Tornado Button */}
      <motion.button
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative w-24 h-24 flex items-center justify-center text-4xl font-bold text-white rounded-full overflow-hidden shadow-2xl"
        animate={{
          scaleY: hovered ? 1.6 : 1, // elongates vertically
          scaleX: hovered ? 0.8 : 1, // compresses width to look like terrain stretch
        }}
        transition={{ type: "spring", stiffness: 150, damping: 12 }}
      >
        {/* Tornado swirling background */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 180deg, rgba(255,255,255,0.2), rgba(0,0,0,0.1), rgba(255,255,255,0.2))",
          }}
          animate={{
            rotate: hovered ? 0 : 360, // slow tornado swirl
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
        ></motion.div>

        {/* Dynamic background overlay */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: hovered
              ? "radial-gradient(circle at center, #ff6a00, #ff0000)"
              : "radial-gradient(circle at center, #4facfe, #00f2fe)",
            opacity: 0.9,
          }}
        ></motion.div>

        {/* Question mark */}
        <span className="z-10">?</span>
      </motion.button>
    </div>
  );
}
