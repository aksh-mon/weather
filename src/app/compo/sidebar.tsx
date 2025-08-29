"use client";
import React from "react";
import { Bug, Footprints, Shell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedGame: React.Dispatch<React.SetStateAction<string>>;
    setMode: React.Dispatch<React.SetStateAction<"game" | "error">>;
}

const Sidebar: React.FC<SidebarProps> = ({
    isSidebarOpen,
    setIsSidebarOpen,
    setSelectedGame,
    setMode,
}) => {
    const router = useRouter();

    const handleClick = (game: string) => {
        setMode("game");
        setSelectedGame(game);
        setIsSidebarOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        router.replace("/");
    };

    return (
        <div
            className={`transition-transform duration-500 ease-in-out
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
      absolute top-0 left-0 h-screen 
      lg:w-[20vw] sm:w-[40vw] w-[60vw] 
      bg-white/50 border-r z-[99] flex flex-col`}
        >
            {/* Scrollable middle section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <button
                    style={{ background: "linear-gradient(to right, #283048, #859398)" }}
                    className="text-white p-3 rounded-2xl flex justify-center"
                >
                    Content <Footprints className="text-white" />
                </button>

                <button
                    style={{ background: "linear-gradient(to right, #5c258d, #4389a2)" }}
                    onClick={() => handleClick("app")}
                    className="cursor-pointer btn flex text-white p-3 gap-3.5 rounded-xl"
                >
                    <Shell className="animate-spin w-4" /> Home
                </button>
                <button
                    style={{ background: "linear-gradient(to right, #5c258d, #4389a2)" }}
                    onClick={() => handleClick("ludo")}
                    className="cursor-pointer btn flex text-white p-3 gap-3.5 rounded-xl"
                >
                    <Shell className="animate-spin w-4" /> Ludo
                </button>
                <button
                    style={{ background: " linear-gradient(to right, #5c258d, #4389a2)" }}
                    onClick={() => handleClick("snake")}
                    className="cursor-pointer btn flex  text-white p-3 gap-3.5 rounded-t-3xl rounded-b-2xl"
                >
                    <Shell className="animate-spin w-4" /> Snake
                </button>
                <button
                    style={{ background: " linear-gradient(to right, #5c258d, #4389a2)" }}
                    onClick={() => handleClick("sudoku")}
                    className="cursor-pointer btn flex  text-white p-3 gap-3.5 rounded-t-3xl rounded-b-2xl"
                >
                    <Shell className="animate-spin w-4" /> Sudoku
                </button>
                <button
                    style={{ background: " linear-gradient(to right, #5c258d, #4389a2)" }}
                    onClick={() => handleClick("flappy")}
                    className="cursor-pointer btn flex  text-white p-3 gap-3.5 rounded-t-3xl rounded-b-2xl"
                >
                    <Shell className="animate-spin w-4" /> FishMON
                </button>
                <button
                    style={{ background: " linear-gradient(to right, #5c258d, #4389a2)" }}
                    onClick={() => handleClick("contra")}
                    className="cursor-pointer btn flex  text-white p-3 gap-3.5 rounded-t-3xl rounded-b-2xl"
                >
                    <Shell className="animate-spin w-4" /> Tetris
                </button>
                <button
                    style={{ background: "linear-gradient(to right, #5c258d, #4389a2)" }}
                    onClick={() => handleClick("cube")}
                    className="cursor-pointer btn flex text-white p-3 gap-3.5 rounded-2xl"
                >
                    <Shell className="animate-spin w-4" /> Cube
                </button>
                <button
                    style={{ background: "linear-gradient(to right, #5c258d, #4389a2)" }}
                    onClick={() => handleClick("car")}
                    className="cursor-pointer btn flex text-white p-3 gap-3.5 rounded-2xl"
                >
                    <Shell className="animate-spin w-4" /> Car
                </button>
                <button
                    style={{ background: "linear-gradient(to right, #5c258d, #4389a2)" }}
                    onClick={() => handleClick("kill")}
                    className="cursor-pointer btn flex text-white p-3 gap-3.5 rounded-2xl"
                >
                    <Shell className="animate-spin w-4" /> Kill
                </button>
                <button
                    style={{ background: "linear-gradient(to right, #5c258d, #4389a2)" }}
                    onClick={() => handleClick("climb")}
                    className="cursor-pointer btn flex text-white p-3 gap-3.5 rounded-2xl"
                >
                    <Shell className="animate-spin w-4" /> Climb
                </button>
                <button
                    style={{ background: "linear-gradient(to right, #5c258d, #4389a2)" }}
                    onClick={() => handleClick("jump")}
                    className="cursor-pointer btn flex text-white p-3 gap-3.5 rounded-2xl"
                >
                    <Shell className="animate-spin w-4" /> Jump
                </button>


                <button
                    onClick={() => {
                        setMode("error");
                        setIsSidebarOpen(false);
                    }}
                    style={{ background: "linear-gradient(to right, #ff512f, #dd2476)" }}
                    className="btn text-white p-3 flex justify-center gap-2.5 cursor-pointer rounded-xl"
                >
                    <Bug className="text-white animate-pulse" /> Show Error
                </button>
            </div>

            {/* Fixed Logout at bottom */}
            <div className="p-4 border-t">
                <button
                    onClick={handleLogout}
                    style={{ background: "linear-gradient(to right, #141e30, #243b55)" }}
                    className="w-full text-white p-3 flex justify-center gap-2.5 cursor-pointer rounded-xl"
                >
                    <LogOut className="text-white" /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
