"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import HeroTagline from "../compo/tagline";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); 

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "aks@321.com" && password === "imadeit") {
      setError("");
      localStorage.setItem("isAuthenticated", "true");
      router.replace("/home");
    } else {
      setError("❌ Account not found. Please create one.");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("✅ Account created successfully (demo). You can now sign in!");
    setMode("login");
    setEmail("");
    setPassword("");
  };

  return (
    <div
      id="body"
      className="relative flex min-h-screen items-center justify-center gap-4 font-mono p-4 overflow-hidden flex-col lg:flex-row"
    >
      {/* 🌌 Starry background */}
      <div className="stars"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>

      {/* Hero Tagline */}
      <HeroTagline />

      {/* Auth Box */}
      <div className="ash relative w-full max-w-md border border-black bg-transparent p-6 sm:p-8 shadow-[8px_8px_0px_black] rounded-xl z-10">
        <div className="absolute top-[6px] left-[6px] right-[-6px] bottom-[-6px] border border-black rounded-xl -z-10" />

        <h1 className="mb-6 text-center text-2xl sm:text-3xl font-bold text-white">
          {mode === "login" ? "LOGIN" : "CREATE ACCOUNT"}
        </h1>

        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.form
              key="login"
              onSubmit={handleLogin}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Email */}
              <div>
                <label className="mb-1 block font-bold text-white">EMAIL</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border-2 border-black bg-white px-3 py-2 text-black outline-none focus:shadow-[4px_4px_0px_black]"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-1 block font-bold text-white">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-2 border-black bg-white px-3 py-2 text-black outline-none focus:shadow-[4px_4px_0px_black]"
                />
              </div>

              {error && (
                <p className="text-center text-sm font-bold text-red-500">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-2 w-full border-2 border-black bg-red-500 py-2 font-bold text-white transition hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_black]"
              >
                SIGN IN
              </button>

              <div className="my-6 flex items-center font-bold text-white">
                <span className="flex-1 border-b-2 border-black"></span>
                <span className="px-2">OR</span>
                <span className="flex-1 border-b-2 border-black"></span>
              </div>

              {/* Social login */}
              <div className="flex justify-center gap-4">
                {["G", "F", "X"].map((s, i) => (
                  <div
                    key={i}
                    className="text-gray-400 flex h-12 w-12 cursor-pointer items-center justify-center border-2 border-black transition hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_black]"
                  >
                    {s}
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center text-white">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  className="font-bold underline"
                >
                  Sign up
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              onSubmit={handleSignup}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Signup fields */}
              <div>
                <label className="mb-1 block font-bold text-white">NAME</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full border-2 border-black text-black bg-white px-3 py-2 outline-none focus:shadow-[4px_4px_0px_black]"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-white">EMAIL</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full border-2 border-black text-black bg-white px-3 py-2 outline-none focus:shadow-[4px_4px_0px_black]"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-white">
                  PHONE NO
                </label>
                <input
                  type="tel"
                  placeholder="+1 234 567 890"
                  className="w-full border-2 border-black text-black bg-white px-3 py-2 outline-none focus:shadow-[4px_4px_0px_black]"
                />
              </div>

              <div>
                <label className="mb-1 block font-bold text-white">GENDER</label>
                <select className="w-full border-2 border-black bg-white px-3 py-2 outline-none text-black focus:shadow-[4px_4px_0px_black]">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["Facebook", "Instagram", "Snapchat"].map((platform) => (
                  <input
                    key={platform}
                    type="text"
                    placeholder={platform}
                    className="w-full border-2 border-black bg-white px-3 py-2 text-black outline-none focus:shadow-[4px_4px_0px_black]"
                  />
                ))}
              </div>

              <div>
                <label className="mb-1 block font-bold text-white">
                  MUSIC INTERESTS
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rock, Jazz, EDM"
                  className="w-full text-black border-2 border-black bg-white px-3 py-2 outline-none focus:shadow-[4px_4px_0px_black]"
                />
              </div>

              {error && (
                <p className="text-center text-sm font-bold text-green-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-2 w-full border-2 border-black bg-green-500 py-2 font-bold text-white transition hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_black]"
              >
                SIGN UP
              </button>

              <div className="mt-6 text-center text-white">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className="font-bold underline"
                >
                  Sign in
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Custom CSS for stars */}
      <style jsx>{`
        #body {
          background: linear-gradient(to bottom, #0b0b2b, #1b2735 70%, #090a0f);
        }
        .stars {
          width: 1px;
          height: 1px;
          position: absolute;
          background: white;
          box-shadow: 2vw 5vh 2px white, 10vw 8vh 2px white, 15vw 15vh 1px white,
            22vw 22vh 1px white, 28vw 12vh 2px white, 32vw 32vh 1px white,
            38vw 18vh 2px white, 42vw 35vh 1px white, 48vw 25vh 2px white,
            53vw 42vh 1px white, 58vw 15vh 2px white, 63vw 38vh 1px white,
            68vw 28vh 2px white, 73vw 45vh 1px white, 78vw 32vh 2px white,
            83vw 48vh 1px white, 88vw 20vh 2px white, 93vw 52vh 1px white,
            98vw 35vh 2px white, 5vw 60vh 1px white, 12vw 65vh 2px white,
            18vw 72vh 1px white, 25vw 78vh 2px white, 30vw 85vh 1px white,
            35vw 68vh 1px white, 40vw 82vh 1px white, 45vw 92vh 1px white,
            50vw 75vh 1px white, 55vw 88vh 1px white, 60vw 95vh 1px white,
            65vw 72vh 2px white, 70vw 85vh 1px white, 75vw 78vh 2px white,
            80vw 92vh 1px white, 85vw 82vh 2px white, 90vw 88vh 1px white,
            95vw 75vh 2px white;
          animation: twinkle 8s infinite linear;
        }
        .stars::after {
          content: "";
          position: absolute;
          width: 1px;
          height: 1px;
          background: white;
          box-shadow: 8vw 12vh 2px white, 16vw 18vh 1px white, 24vw 25vh 2px white,
            33vw 15vh 1px white, 41vw 28vh 2px white, 49vw 35vh 1px white,
            57vw 22vh 2px white, 65vw 42vh 1px white, 73vw 28vh 2px white,
            81vw 48vh 1px white, 89vw 32vh 2px white, 97vw 45vh 1px white,
            3vw 68vh 2px white, 11vw 75vh 1px white, 19vw 82vh 2px white,
            27vw 88vh 1px white, 35vw 72vh 2px white, 43vw 85vh 1px white,
            51vw 92vh 2px white, 59vw 78vh 1px white;
          animation: twinkle 6s infinite linear reverse;
        }
        .shooting-star {
          position: absolute;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, white, transparent);
          animation: shoot 3s infinite ease-in;
        }
        .shooting-star:nth-child(2) {
          top: 20%;
          left: -100px;
          animation-delay: 0s;
        }
        .shooting-star:nth-child(3) {
          top: 35%;
          left: -100px;
          animation-delay: 1s;
        }
        .shooting-star:nth-child(4) {
          top: 50%;
          left: -100px;
          animation-delay: 2s;
        }
        .shooting-star:nth-child(5) {
          top: 65%;
          left: -100px;
          animation-delay: 3s;
        }
        .shooting-star:nth-child(6) {
          top: 80%;
          left: -100px;
          animation-delay: 4s;
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.4;
          }
        }
        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(25deg);
            opacity: 1;
          }
          100% {
            transform: translateX(120vw) translateY(50vh) rotate(25deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
