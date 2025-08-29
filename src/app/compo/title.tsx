"use client";
import { motion } from "framer-motion";

export default function Title() {
  return (
    <div className="flex justify-center items-center h-screen bg-black ash">
      <motion.h2
        className="relative text-4xl sm:text-2xl font-extrabold tracking-wide"
        style={{
          color: "#0ff", // Neon cyan
          textShadow: `
            0 0 5px #0ff,
            0 0 10px #0ff,
            0 0 20px #0ff,
            0 0 40px #0ff,
            0 0 80px #0ff
          `,
        }}
        animate={{
          textShadow: [
            "0 0 5px #0ff, 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff",
            "0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff, 0 0 80px #0ff",
            "0 0 5px #0ff, 0 0 15px #0ff, 0 0 25px #0ff, 0 0 50px #0ff",
          ],
          color: ["#0ff", "#fff", "#0ff"], // Flicker between cyan & white
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        weatherORwhether
      </motion.h2>
    </div>
  );
}
