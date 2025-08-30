"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import App from "../app/page";
import Error from "../404/page";
import Sudoku from "../sudoku/page";
import FlappyBirdGame from "../flappyBird/page";
import Contra from "../contra/page";
import Snake from "../snake/page";
import Ludo from "../ludo/page";
import Cube from "../cube/page";
import Car from "../car/page";
import Kill from "../kill/page";
import Climb from "../mountain/page";
import Jump from "../mario/page";

import Header from "../compo/header";
import Toggle from "../compo/toggle";

export default function Home() {
  const [selectedGame, setSelectedGame] = useState("app");
  const [mode, setMode] = useState<"game" | "error">("game");
  const [bgColor, setBgColor] = useState("");
  const router = useRouter();

  // ✅ Check auth when Home mounts
  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (!isAuth) {
      router.replace("/"); // redirect to login if not authenticated
    }
  }, [router]);

  const renderGame = () => {
    if (mode === "error") {
      return <Error />;
    }

    switch (selectedGame) {
      case "ludo":
        return <Ludo />;
      case "snake":
        return <Snake />;
      case "sudoku":
        return <Sudoku />;
      case "flappy":
        return <FlappyBirdGame />;
      case "contra":
        return <Contra />;
      case "cube":
        return <Cube />;
      case "car":
        return <Car />;
      case "kill":
        return <Kill />;
      case "climb":
        return <Climb />;
      case "jump":
        return <Jump />;
      case "app":
      default:
        return <App />;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header (with Sidebar toggle) */}
      {/* Main Content */}
      <main
        className="flex-1 h-screen"
        style={{
          backgroundColor: bgColor,
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        {renderGame()}
        <Toggle onToggle={setBgColor} />
        
      <Header setSelectedGame={setSelectedGame} setMode={setMode} />
      </main>
      {/* Footer */}
      {/* <Footnote /> */}
    </div>
  );
}
