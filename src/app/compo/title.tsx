"use client";
import { motion } from "framer-motion";

export default function Title() {
  return (
    <div className="ash">
      <motion.h2
        className="relative text-3xl sm:text-3xl lg:text-6xl font-extrabold tracking-wide "
        style={{
          background: "linear-gradient(270deg, #aaa, #999, #777, #555,#ddd,#3296,#000, #777, #999, #aaa)",
          backgroundSize: "400% 400%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 10px rgba(180,180,180,0.7), 0 0 20px rgba(160,160,160,0.5)",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%"],
          textShadow: [
            "0 0 10px rgba(200,200,200,0.7), 0 0 20px rgba(180,180,180,0.5)",
            "0 0 20px rgba(220,220,220,0.9), 0 0 30px rgba(200,200,200,0.7)",
            "0 0 10px rgba(200,200,200,0.7), 0 0 20px rgba(180,180,180,0.5)",
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        Beyond the Weather
      </motion.h2>
    </div>
  );
}
