"use client";
import { useState } from "react";
import App from "../app/app/page";
import Error from '../app/404/page'
import Sudoku from "../app/sudoku/page";
import Footnote from "../app/footnote/page";
import FlappyBirdGame from "./flappyBird/page";
import Contra from "./contra/page";
import Snake from "./snake/page";
import Ludo from "./ludo/page";
import Cube from "./cube/page";
import Car from "./car/page";

import Header from "./compo/header";
import Toggle from "./compo/toggle";

export default function Home() {
  const [selectedGame, setSelectedGame] = useState("app"); // default game
  const [mode, setMode] = useState<"game" | "error">("game"); // game or error
  const [bgColor, setBgColor] = useState("");

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
        return <Cube/>  
      case "car":
        return <Car/>  
      case "app":
      default:
        return <App />;
    }
  };

  return (
    <div className=" h-screen flex flex-col">
      {/* Header (with Sidebar toggle) */}
      <Header setSelectedGame={setSelectedGame} setMode={setMode} />

      {/* Main Content */}
      <main
        className="flex-1 h-screen"
        style={{ backgroundColor: bgColor, transition: "background-color 0.3s ease-in-out" }}
      >
        {renderGame()}
        <Toggle onToggle={setBgColor} />
      </main>

      {/* Footer */}
      <Footnote />
    </div>
  );
}
