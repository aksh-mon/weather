/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { useEffect, useRef, useState } from "react";
type HeadlineProps = {
  title: string;
};
const headline: React.FC<HeadlineProps> = ({ title }) => {
  const colors = [
    "#0ff", // Cyan
    "#ff0", // Yellow
    "#0f0", // Lime
    "#f80", // Orange
    "#3296ff", // Sky Blue
    "#39ff14", // Neon Green
    "#ff073a", // Neon Red
    "#ff6ec7", // Neon Pink
    "#fe019a", // Bright Pink
    "#00ffff", // Aqua
    "#ffcc00", // Bright Yellow
    "#ff0090", // Hot Pink
    "#ff9933", // Orange-ish
    "#00ffcc", // Bright Turquoise
    "#ffd1dc", // Light Pink
    "#c1f0f6", // Light Aqua
    "#f9f871", // Light Yellow
    "#caffb9", // Mint
    "#e0bbff", // Lavender
    "#ffdab9", // Peach Puff
    "#add8e6", // Light Blue
    "#f0e68c", // Khaki
    "#7f00ff", // Purple
    "#e100ff", // Electric Violet
    "#00c9ff", // Sky Blue
    "#92fe9d", // Light Green
    "#f7971e", // Orange Peel
    "#ffd200", // Golden
    "#2b5876",
    "#4e4376",
    "#1e3c72",
    "#2a5298",
    "#232526",
    "#414345",
  ];

  const [timer, setTimer] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    startColorCycle();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startColorCycle = () => {
    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setColorIndex((prev) => (prev + 1) % colors.length);
      }
    }, 3000);
  };

  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
  };
  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted]);

  return (
    <h2
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="text-4xl uppercase tracking-[.5rem] font-light  transition-all duration-300 bg-amber-50 p-2 text-center rounded-3xl my-3"
      style={{
        color: colors[colorIndex],
        textShadow: `0 0 10px ${colors[colorIndex]}, 0 0 20px ${colors[colorIndex]}`,
      }}
    >
      {title}
    </h2>
  );
};

export default headline;
