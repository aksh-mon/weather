import { motion } from "framer-motion";

export default function HeroTagline() {
  return (
    <div className="text-center px-4 max-w-3xl mx-auto">
      {/* Main Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white relative"
      >
        WELCOME TO THE SHOW <br />
        <span className="bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent animate-lightflow">
          Setting Your Imagination to New Heights
        </span>
        <br />
        <span className="text-gray-300 text-lg sm:text-xl md:text-2xl">
          Where creativity meets experience.
        </span>
      </motion.h2>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-6 text-sm sm:text-base md:text-lg text-gray-400 italic"
      >
        Explore, Imagine, and Experience content crafted to inspire you.
      </motion.p>

      <style jsx>{`
        /* Gradient flowing animation */
        .animate-lightflow {
          background-size: 200% auto;
          animation: lightflow 3s linear infinite;
        }
        @keyframes lightflow {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
    </div>
  );
}
