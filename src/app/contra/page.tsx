/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useEffect, useRef, useState } from "react";

import Headline from "../compo/headline";
import {
  ArrowBigLeft,
  RotateCcw,
  ArrowBigRight,
  ArrowBigDownDash,
} from "lucide-react";

const ROWS = 20;
const COLS = 10;

const shapes = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [1, 0, 0],
    [1, 1, 1],
  ], // J
  [
    [0, 0, 1],
    [1, 1, 1],
  ], // L
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // Z
];

const randomShape = () => {
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  return {
    shape,
    x: Math.floor((COLS - shape[0].length) / 2),
    y: 0,
  };
};

const TetrisGame = () => {
  const [grid, setGrid] = useState<number[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const [current, setCurrent] = useState(randomShape());
  const [isGameOver, setIsGameOver] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const merge = (
    shape: typeof current.shape,
    grid: number[][],
    offsetX: number,
    offsetY: number
  ) => {
    return grid.map((row, y) =>
      row.map((cell, x) => (shape[y - offsetY]?.[x - offsetX] ? 1 : cell))
    );
  };

  const collides = (
    shape: typeof current.shape,
    offsetX: number,
    offsetY: number
  ) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (
          shape[y][x] &&
          (grid[y + offsetY]?.[x + offsetX] === undefined ||
            grid[y + offsetY]?.[x + offsetX])
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const rotate = (shape: number[][]) =>
    shape[0].map((_, i) => shape.map((row) => row[i]).reverse());

  const move = (dx: number, dy: number, rotateShape = false) => {
    const newShape = rotateShape ? rotate(current.shape) : current.shape;
    const newX = current.x + dx;
    const newY = current.y + dy;
    if (!collides(newShape, newX, newY)) {
      setCurrent({ ...current, shape: newShape, x: newX, y: newY });
    } else if (dy > 0 && !rotateShape) {
      const merged = merge(current.shape, grid, current.x, current.y);
      const newGrid = merged.filter((row) => row.some((cell) => cell === 0));
      const cleared = ROWS - newGrid.length;
      while (newGrid.length < ROWS) newGrid.unshift(Array(COLS).fill(0));
      setGrid(newGrid);
      const next = randomShape();
      if (collides(next.shape, next.x, next.y)) {
        setIsGameOver(true);
        clearInterval(intervalRef.current!);
      } else {
        setCurrent(next);
      }
    }
  };

  const drop = () => move(0, 1);
  const left = () => move(-1, 0);
  const right = () => move(1, 0);
  const rotateBlock = () => move(0, 0, true);
  const fastDrop = () => move(0, 1);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      e.preventDefault();
      if (isGameOver) return;
      switch (e.key) {
        case "ArrowLeft":
          left();
          break;
        case "ArrowRight":
          right();
          break;
        case "ArrowDown":
          fastDrop();
          break;
        case "ArrowUp":
          rotateBlock();
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current, isGameOver]);

  useEffect(() => {
    if (startTime === null) {
      setStartTime(Date.now());
    }

    intervalRef.current = setInterval(() => {
      if (!isGameOver) {
        drop();
        setElapsed(Math.floor((Date.now() - (startTime ?? Date.now())) / 1000));
      }
    }, 800);

    return () => clearInterval(intervalRef.current!);
  }, [current, startTime, isGameOver]);

  const displayGrid = merge(current.shape, grid, current.x, current.y);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="flex flex-col items-center mt-8 gap-4">
      <Headline title="TETRIS" />
      <div className="text-lg font-mono text-gray-800">
        ⏱️ Time: {minutes}m {seconds}s
      </div>
      <div className="grid grid-cols-10 gap-[1px] bg-gray-400 p-1 border-4 border-purple-500 rounded">
        {displayGrid.flat().map((cell, i) => (
          <div
            key={i}
            className={`w-6 h-6 ${cell ? "bg-purple-600" : "bg-white"}`}
          />
        ))}
      </div>

      {isGameOver && (
        <div className="mt-4 text-center text-2xl font-bold text-red-600 animate-pulse">
          💀 Game Over!
        </div>
      )}

      {/* Mobile controls */}
      <div className="flex gap-3 mt-6 md:hidden">
        <button
          className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-blue-300"
          onClick={left}
        >
          <ArrowBigLeft color="#fff" />
        </button>
        <button
          className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-blue-300"
          onClick={rotateBlock}
        >
          {" "}
          <RotateCcw color="#fff" />
        </button>
        <button
          className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-blue-300"
          onClick={fastDrop}
        >
          <ArrowBigDownDash color="#fff" />
        </button>

        <button
          className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-blue-300"
          onClick={right}
        >
          <ArrowBigRight color="#fff" />
        </button>
      </div>
    </div>
  );
};

export default TetrisGame;
