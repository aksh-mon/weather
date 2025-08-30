/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";

interface HomeProps {
  backgroundType: "video" | "image" | "solid"; // control background
  backgroundSrc?: string; // video or image url
}

export default function HomePage({
  backgroundType = "solid",
  backgroundSrc,
}: HomeProps) {
  return (
    <div className="relative w-full h-screen flex items-center justify-center text-white">
      {/* Background */}
      {backgroundType === "video" && backgroundSrc && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundSrc} type="video/mp4" />
        </video>
      )}
      {backgroundType === "image" && backgroundSrc && (
        <img
          src={backgroundSrc}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {backgroundType === "solid" && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700" />
      )}

      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold mb-6">🌪 Tornado World</h1>
        <button className="btn-wind px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-500">
          Enter
        </button>
      </div>

      {/* Wind Shadow Effect */}
      <style jsx>{`
        .btn-wind {
          background: white;
          color: black;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.8),
            0 0 30px rgba(200, 200, 200, 0.6),
            0 0 60px rgba(150, 150, 150, 0.4);
        }
        .btn-wind:hover {
          filter: grayscale(100%);
          background: black;
          color: white;
          transition: all 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
