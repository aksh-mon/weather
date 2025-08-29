"use client";
import { motion } from "framer-motion";

export default function Title() {
  return (
    <div className="flex justify-center items-center h-screen ash">
      <motion.h2
        className="relative text-4xl sm:text-xl lg:text-6xl font-extrabold tracking-wide"
        style={{
          background: "linear-gradient(90deg, #aaa, #666, #aaa)", 
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%"], // shimmer effect
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        weatherORwhether
      </motion.h2>
    </div>
  );
}
