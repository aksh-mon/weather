/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useRef } from "react";
import Headline from "../compo/headline";

const ROWS = 20;
const COLS = 20;
const BLOCK_SIZE = 20;

const shapes = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
];

const getRandomShape = () => shapes[Math.floor(Math.random() * shapes.length)];
const emptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const TetrisPage = () => {
  const [board, setBoard] = useState(emptyBoard());
  const [shape, setShape] = useState(getRandomShape());
  const [position, setPosition] = useState({ row: 0, col: 4 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const moveSound = useRef<HTMLAudioElement | null>(null);
  const rotateSound = useRef<HTMLAudioElement | null>(null);
  const downSound = useRef<HTMLAudioElement | null>(null);

  const mergeShapeToBoard = (shape: number[][], pos: any, base: number[][]) => {
    const newBoard = base.map((row) => [...row]);
    shape.forEach((r, i) =>
      r.forEach((cell, j) => {
        if (
          cell &&
          newBoard[pos.row + i] &&
          newBoard[pos.row + i][pos.col + j] !== undefined
        ) {
          newBoard[pos.row + i][pos.col + j] = cell;
        }
      })
    );
    return newBoard;
  };

  const isValidMove = (shape: number[][], pos: any) => {
    return shape.every((row, i) =>
      row.every((cell, j) => {
        const x = pos.row + i;
        const y = pos.col + j;
        return (
          !cell ||
          (x >= 0 && x < ROWS && y >= 0 && y < COLS && board[x][y] === 0)
        );
      })
    );
  };

  const rotate = (matrix: number[][]) =>
    matrix[0].map((_, i) => matrix.map((row) => row[i]).reverse());

  const clearFullRows = (newBoard: number[][]) => {
    const filtered = newBoard.filter((row) => row.some((cell) => cell === 0));
    const cleared = ROWS - filtered.length;
    if (cleared > 0) {
      setScore((prev) => prev + cleared * 100);
      const newRows = Array(cleared).fill(Array(COLS).fill(0));
      setBoard([...newRows, ...filtered]);
    } else {
      setBoard(newBoard);
    }
  };

  const drop = () => {
    setPosition((prevPos) => {
      const newPos = { row: prevPos.row + 1, col: prevPos.col };
      if (isValidMove(shape, newPos)) {
        return newPos;
      } else {
        const newBoard = mergeShapeToBoard(shape, prevPos, board);
        clearFullRows(newBoard);

        const newShape = getRandomShape();
        const startPos = { row: 0, col: 4 };

        if (!isValidMove(newShape, startPos)) {
          setGameOver(true);
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (timerRef.current) clearInterval(timerRef.current);
          return prevPos;
        } else {
          setShape(newShape);
          return startPos;
        }
      }
    });
  };

  const startGame = () => {
    setBoard(emptyBoard());
    setShape(getRandomShape());
    setPosition({ row: 0, col: 4 });
    setGameOver(false);
    setScore(0);
    setElapsed(0);

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    intervalRef.current = setInterval(() => drop(), 500);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };

  useEffect(() => {
    moveSound.current = new Audio("move.wav");
    rotateSound.current = new Audio("/sounds/rotate.mp3");
    downSound.current = new Audio("/sounds/down.mp3");
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      if (e.key === "ArrowLeft") {
        const newPos = { row: position.row, col: position.col - 1 };
        if (isValidMove(shape, newPos)) {
          setPosition(newPos);
          moveSound.current?.play();
        }
      } else if (e.key === "ArrowRight") {
        const newPos = { row: position.row, col: position.col + 1 };
        if (isValidMove(shape, newPos)) {
          setPosition(newPos);
          moveSound.current?.play();
        }
      } else if (e.key === "ArrowDown") {
        drop();
        downSound.current?.play();
      } else if (e.key === "ArrowUp") {
        const rotated = rotate(shape);
        if (isValidMove(rotated, position)) {
          setShape(rotated);
          rotateSound.current?.play();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [shape, position, board, gameOver]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const currentBoard = mergeShapeToBoard(shape, position, board);

  // Mobile Controls
  const handleMobileMove = (dir: "left" | "right" | "down" | "rotate") => {
    if (gameOver) return;

    if (dir === "left") {
      const newPos = { row: position.row, col: position.col - 1 };
      if (isValidMove(shape, newPos)) {
        setPosition(newPos);
        moveSound.current?.play();
      }
    } else if (dir === "right") {
      const newPos = { row: position.row, col: position.col + 1 };
      if (isValidMove(shape, newPos)) {
        setPosition(newPos);
        moveSound.current?.play();
      }
    } else if (dir === "down") {
      drop();
      downSound.current?.play();
    } else if (dir === "rotate") {
      const rotated = rotate(shape);
      if (isValidMove(rotated, position)) {
        setShape(rotated);
        rotateSound.current?.play();
      }
    }
  };

  return (
    <div
      className="w-full h-screen py-5 flex flex-col items-center justify-center relative"
      style={{
        background:
          "linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%)",
      }}
    >
      <Headline title="MONtet" />

      <div className="flex justify-between items-center w-full max-w-lg px-4 text-white font-mono text-lg mb-3">
        <div>Score: {score}</div>
        <div>
          Time: {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </div>
        <button
          onClick={startGame}
          className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
        >
          Start Game
        </button>
      </div>

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
            className={`border border-gray-700 ${
              cell ? "bg-green-400" : "bg-black"
            }`}
          ></div>
        ))}
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden mt-6 flex flex-col items-center gap-2">
        <button
          className="bg-black text-white px-8 py-2 rounded"
          onClick={() => handleMobileMove("rotate")}
        >
          ⬆️
        </button>
        <div className="flex gap-4">
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => handleMobileMove("left")}
          >
            ⬅️
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => handleMobileMove("down")}
          >
            ⬇️
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => handleMobileMove("right")}
          >
            ➡️
          </button>
        </div>
      </div>

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
