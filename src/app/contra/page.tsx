 import React, { useEffect, useState, useRef } from "react";
import Headline from "../compo/headline";
import {
  ArrowBigLeft,
  ArrowBigRight,
  ArrowBigDownDash,
  RotateCcw,
  Play,
} from "lucide-react";

const ROWS = 20;
const COLS = 20;
const BLOCK_SIZE = 20;

// ...shapes and getRandomShape unchanged...

const emptyBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const TetrisPage = () => {
  const [board, setBoard] = useState(emptyBoard());
  const [shape, setShape] = useState(getRandomShape());
  const [position, setPosition] = useState({ row: 0, col: 4 });
  const [gameOver, setGameOver] = useState(false);

  // --- Score and Timer additions ---
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Existing interval for dropping pieces ---
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ...mergeShapeToBoard, isValidMove, rotate as before...

  const drop = () => {
    const newPos = { row: position.row + 1, col: position.col };
    if (isValidMove(shape, newPos)) {
      setPosition(newPos);
    } else {
      const newBoard = mergeShapeToBoard(shape, position, board);
      clearFullRows(newBoard);
      const newShape = getRandomShape();
      const startPos = { row: 0, col: 4 };

      if (!isValidMove(newShape, startPos)) {
        setGameOver(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setShape(newShape);
        setPosition(startPos);
        setBoard(newBoard);
      }
    }
  };

  // --- Enhanced row clearing to update score ---
  const clearFullRows = (newBoard: number[][]) => {
    const fullRows = newBoard.filter(row => row.every(cell => cell !== 0));
    const numCleared = fullRows.length;
    if (numCleared > 0) {
      setScore(prev => prev + numCleared * 100);
    }
    const filtered = newBoard.filter(row => row.some(cell => cell === 0));
    const cleared = Array(ROWS - filtered.length).fill(Array(COLS).fill(0));
    setBoard([...cleared, ...filtered]);
  };

  // ...move as before...

  // --- Piece drop interval ---
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      drop();
    }, 500);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)
      ) {
        e.preventDefault();
      }
      if (gameOver) return;
      if (e.key === "ArrowLeft") move("left");
      else if (e.key === "ArrowRight") move("right");
      else if (e.key === "ArrowDown") move("down");
      else if (e.key === "ArrowUp") move("rotate");
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shape, position, board, gameOver]);

  // --- Timer logic ---
  useEffect(() => {
    if (gameOver) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameOver]);

  const currentBoard = mergeShapeToBoard(shape, position, board);

  // --- Reset score and timer on new game ---
  const startGame = () => {
    setBoard(emptyBoard());
    setShape(getRandomShape());
    setPosition({ row: 0, col: 4 });
    setGameOver(false);
    setScore(0);
    setTimer(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      drop();
    }, 500);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
  };

  useEffect(() => {
    startGame();
  }, []);

  // --- Format timer display ---
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="w-full h-screen py-5 flex flex-col items-center justify-center relative"
      style={{
        background:
          "linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%)",
      }}
    >
      <Headline title="treeMON" />
      <button onClick={startGame} className="p-2 bg-transparent text-white flex justify-center items-center">
        Play <Play color="#3296"/>
      </button>

      {/* --- Score and timer display --- */}
      <div className="flex gap-8 my-4 text-xl text-white font-bold">
        <div>Score: {score}</div>
        <div>Time: {formatTime(timer)}</div>
      </div>

      {/* ...board rendering and controls unchanged... */}

      <div
        className="grid border-4 border-white"
        style={{
          gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          width: `${COLS * BLOCK_SIZE}px`,
          height: `${ROWS * BLOCK_SIZE}px`,
        }}
      >
        {currentBoard.flat().map((cell, i) => (
          <div
            key={i}
            className={`border border-gray-700 ${cell ? "bg-green-400" : "bg-black"}`}
          ></div>
        ))}
      </div>

      {/* ...mobile buttons and game over dialog unchanged... */}

<div className="flex sm:hidden gap-3 mt-6">
        <button
          onClick={() => move("left")}
          className="bg-gray-700 hover:bg-blue-300 text-black px-4 py-2 rounded-lg"
        >
          <ArrowBigLeft color="#fff" /> 
        </button>
        <button
          onClick={() => move("rotate")}
          className="bg-gray-700 hover:bg-blue-300 text-black px-4 py-2 rounded-lg"
        >
          <RotateCcw  color="#fff"/>
        </button>
      
        <button
          onClick={() => move("down")}
          className="bg-gray-700 hover:bg-blue-300 text-black px-4 py-2 rounded-lg"
        >
          <ArrowBigDownDash color="#fff"/>
        </button>
  <button onClick={() => move("right")}
          className="bg-gray-700 hover:bg-blue-300 text-black px-4 py-2 rounded-lg"
        >
          <ArrowBigRight color="#fff"/>
        </button>
      </div>

      <Headline title="tetris" />

      {gameOver && (
        <div className="absolute bg-white text-black px-6 py-4 rounded-2xl text-center shadow-xl text-2xl animate-pulse space-y-4">
          <div>
            🎮 Game Over!
            <br />
            Wanna try again?
          </div>
          <button
            onClick={startGame}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            🔄 Restart Game
          </button>
        </div>
      )}
    </div>
  );
};

export default TetrisPage;