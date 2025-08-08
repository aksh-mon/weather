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

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
      } else {
        setShape(newShape);
        setPosition(startPos);
      }
    }
  };

  const clearFullRows = (newBoard: number[][]) => {
    const filtered = newBoard.filter((row) => row.some((cell) => cell === 0));
    const cleared = Array(ROWS - filtered.length).fill(Array(COLS).fill(0));
    setBoard([...cleared, ...filtered]);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      drop();
    }, 500);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) return;

      if (e.key === "ArrowLeft") {
        const newPos = { row: position.row, col: position.col - 1 };
        if (isValidMove(shape, newPos)) setPosition(newPos);
      } else if (e.key === "ArrowRight") {
        const newPos = { row: position.row, col: position.col + 1 };
        if (isValidMove(shape, newPos)) setPosition(newPos);
      } else if (e.key === "ArrowDown") {
        drop();
      } else if (e.key === "ArrowUp") {
        const rotated = rotate(shape);
        if (isValidMove(rotated, position)) setShape(rotated);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [shape, position, board, gameOver]);

  const handleMobileControl = (direction: string) => {
    if (gameOver) return;

    if (direction === "left") {
      const newPos = { row: position.row, col: position.col - 1 };
      if (isValidMove(shape, newPos)) setPosition(newPos);
    } else if (direction === "right") {
      const newPos = { row: position.row, col: position.col + 1 };
      if (isValidMove(shape, newPos)) setPosition(newPos);
    } else if (direction === "down") {
      drop();
    } else if (direction === "rotate") {
      const rotated = rotate(shape);
      if (isValidMove(rotated, position)) setShape(rotated);
    }
  };

  const currentBoard = mergeShapeToBoard(shape, position, board);

  const startGame = () => {
    setBoard(emptyBoard());
    setShape(getRandomShape());
    setPosition({ row: 0, col: 4 });
    setGameOver(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      drop();
    }, 500);
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

      {/* Mobile Controls */}
      <div className="flex gap-3 mt-6 md:hidden">
        <button onClick={() => handleMobileControl("left")} className="bg-black text-white px-4 py-2 rounded-lg">⬅️</button>
        <button onClick={() => handleMobileControl("rotate")} className="bg-black text-white px-4 py-2 rounded-lg">🔄</button>
        <button onClick={() => handleMobileControl("right")} className="bg-black text-white px-4 py-2 rounded-lg">➡️</button>
        <button onClick={() => handleMobileControl("down")} className="bg-black text-white px-4 py-2 rounded-lg">⬇️</button>
      </div>

      <Headline title="tetMON" />
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
