"use client";
import React, { useEffect, useState } from "react";
import { Bug, Footprints, Shell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedGame: React.Dispatch<React.SetStateAction<string>>;
    setMode: React.Dispatch<React.SetStateAction<"game" | "error">>;
}

const messages = [
    "🎮 Powering up your imagination...",
    "✨ Ready to level up?",
    "🔥 New adventures await you!",
    "🎵 Tune in, play on, vibe high!",
    "🌌 Explore, conquer, repeat.",
];

const psSymbols = ["✕", "◯", "□", "△"];

const Sidebar: React.FC<SidebarProps> = ({
    isSidebarOpen,
    setIsSidebarOpen,
    setSelectedGame,
    setMode,
}) => {
    const router = useRouter();
    const [currentMessage, setCurrentMessage] = useState(0);

    const handleClick = (game: string) => {
        setMode("game");
        setSelectedGame(game);
        setIsSidebarOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        router.replace("/");
    };

    // Cycle messages every 3s
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessage((prev) => (prev + 1) % messages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            style={{scrollbarWidth:'none'}} 
            className={`transition-transform duration-500 ease-in-out
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
      absolute top-0 left-0 h-screen 
      lg:w-[20vw] sm:w-[40vw] w-[60vw] 
      bg-gradient-to-b from-[#141E30] to-[#243B55] 
      border-r z-[99] flex flex-col overflow-hidden`}
        >
            {/* Scrollable middle section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10">
                {/* Content Button */}
                <div className="relative">
                    <button className="relative text-white p-3 rounded-2xl flex justify-center bg-gradient-to-r from-[#74a1bb] to-[#5b200c] shadow-md hover:scale-105 transition overflow-hidden w-full">
                        <span className="relative z-10 flex items-center gap-2">
                            Content <Footprints className="ml-2" />
                        </span>
                        {/* Floating symbols inside button */}
                        {psSymbols.map((symbol, i) => (
                            <motion.span
                                key={i}
                                className="absolute text-white/10 text-xl font-bold select-none"
                                style={{
                                    top: `${Math.random() * 60 + 10}%`,
                                    left: `${Math.random() * 60 + 10}%`,
                                }}
                                animate={{ y: [0, -10, 0], opacity: [0.3, 0.8, 0.3], rotate: [0, 15, -15, 0] }}
                                transition={{
                                    duration: 5 + i,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                {symbol}
                            </motion.span>
                        ))}
                    </button>
                </div>

                {/* Game Buttons */}
                {[
                    ["app", "Home"],
                    ["ludo", "Ludo"],
                    ["snake", "Snake"],
                    ["sudoku", "Sudoku"],
                    ["flappy", "FishMON"],
                    ["contra", "Tetris"],
                    ["cube", "Cube"],
                    ["car", "Car"],
                    ["kill", "Kill"],
                    ["climb", "Climb"],
                    ["jump", "Jump"],
                ].map(([key, label]) => (
                    <div key={key} className="relative">
                        <button
                            onClick={() => handleClick(key)}
                            className="relative flex items-center gap-3 p-3 w-full rounded-t-3xl text-white 
                bg-stone-800 shadow-md hover:scale-105 transition overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Shell className="animate-spin w-4" /> {label}
                            </span>
                            {psSymbols.map((symbol, i) => (
                                <motion.span
                                    key={i}
                                    className="absolute text-white/10 text-xl font-bold select-none"
                                    style={{
                                        top: `${Math.random() * 60 + 10}%`,
                                        left: `${Math.random() * 60 + 10}%`,
                                    }}
                                    animate={{
                                        y: [0, -10, 0],
                                        opacity: [0.3, 0.8, 0.3],
                                        rotate: [0, 15, -15, 0],
                                    }}
                                    transition={{
                                        duration: 5 + i,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    {symbol}
                                </motion.span>
                            ))}
                        </button>
                    </div>
                ))}

                {/* Error Button */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setMode("error");
                            setIsSidebarOpen(false);
                        }}
                        className="relative flex items-center justify-center gap-3 p-3 w-full rounded-xl text-white 
              bg-gradient-to-r from-[#ff512f] to-[#dd2476] shadow-md hover:scale-105 transition overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <Bug className="animate-pulse" /> Show Error
                        </span>
                        {psSymbols.map((symbol, i) => (
                            <motion.span
                                key={i}
                                className="absolute text-white/10 text-xl font-bold select-none"
                                style={{
                                    top: `${Math.random() * 60 + 10}%`,
                                    left: `${Math.random() * 60 + 10}%`,
                                }}
                                animate={{
                                    y: [0, -10, 0],
                                    opacity: [0.3, 0.8, 0.3],
                                    rotate: [0, 15, -15, 0],
                                }}
                                transition={{
                                    duration: 5 + i,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                {symbol}
                            </motion.span>
                        ))}
                    </button>
                </div>
            </div>

            {/* Dynamic message section */}
            <div className="p-4 border-t relative z-10">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentMessage}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.6 }}
                        className="text-center text-sm text-white italic"
                    >
                        {messages[currentMessage]}
                    </motion.p>
                </AnimatePresence>
                <div className="relative">
                    <button
                        onClick={handleLogout}
                        className="relative mt-4 w-full flex justify-center gap-3 p-3 rounded-xl text-white 
              bg-gradient-to-r from-[#141e30] to-[#243b55] shadow-md hover:scale-105 transition overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <LogOut /> Logout
                        </span>
                        {psSymbols.map((symbol, i) => (
                            <motion.span
                                key={i}
                                className="absolute text-white/10 text-xl font-bold select-none"
                                style={{
                                    top: `${Math.random() * 60 + 10}%`,
                                    left: `${Math.random() * 60 + 10}%`,
                                }}
                                animate={{
                                    y: [0, -10, 0],
                                    opacity: [0.3, 0.8, 0.3],
                                    rotate: [0, 15, -15, 0],
                                }}
                                transition={{
                                    duration: 5 + i,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                {symbol}
                            </motion.span>
                        ))}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
