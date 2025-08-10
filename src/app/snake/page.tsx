/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import FlipNumbers from "react-flip-numbers";
import Headline from "../compo/headline";

/**
 * Single-file Snake game React component for Next.js (App Router).
 * - Uses Tailwind for styling
 * - Click "Play" to start, arrow keys to control, on-screen buttons for mobile
 * - Score, high score (localStorage), speed increases as snake grows
 */

type Pos = { x: number; y: number };

export default function SnakePage() {
  const ROWS = 20;
  const COLS = 20;
  const INITIAL_SPEED = 200; // ms per step

  const [snake, setSnake] = useState<Pos[]>([{ x: 9, y: 9 }]);
  const [dir, setDir] = useState<Pos>({ x: 0, y: 0 });
  const [food, setFood] = useState<Pos>(() =>
    randomFood([{ x: 9, y: 9 }], 20, 20)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const v = localStorage.getItem("snake_highscore");
      return v ? Number(v) : 0;
    } catch (e) {
      return 0;
    }
  });

  const intervalRef = useRef<number | null>(null);
  const dirRef = useRef(dir);
  dirRef.current = dir;
  const snakeRef = useRef(snake);
  snakeRef.current = snake;

  useEffect(() => {
    // keyboard
    const onKey = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === "ArrowUp" || e.key === "w") setDirSafe({ x: 0, y: -1 });
      if (e.key === "ArrowDown" || e.key === "s") setDirSafe({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" || e.key === "a") setDirSafe({ x: -1, y: 0 });
      if (e.key === "ArrowRight" || e.key === "d") setDirSafe({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    // game loop
    intervalRef.current = window.setInterval(() => {
      step();
    }, speed);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isPlaying, speed]);

  useEffect(() => {
    // store highscore when changed
    try {
      localStorage.setItem("snake_highscore", String(highScore));
    } catch (e) {}
  }, [highScore]);

  function setDirSafe(next: Pos) {
    // Prevent reversing into self
    const d = dirRef.current;
    if (d.x + next.x === 0 && d.y + next.y === 0) return;
    setDir(next);
  }

  function step() {
    const current = snakeRef.current;
    const d = dirRef.current;
    if (d.x === 0 && d.y === 0) return; // not moving yet

    const head = current[0];
    const newHead = { x: head.x + d.x, y: head.y + d.y };

    // wall collision -> wrap around OR game over. We'll make it wrap.
    if (newHead.x < 0) newHead.x = COLS - 1;
    if (newHead.x >= COLS) newHead.x = 0;
    if (newHead.y < 0) newHead.y = ROWS - 1;
    if (newHead.y >= ROWS) newHead.y = 0;

    // self collision
    if (current.some((s) => s.x === newHead.x && s.y === newHead.y)) {
      endGame();
      return;
    }

    const ate = food.x === newHead.x && food.y === newHead.y;
    const newSnake = [newHead, ...current];
    if (!ate) newSnake.pop();

    setSnake(newSnake);

    if (ate) {
      setScore((s) => s + 10);
      // increase speed slightly every few points
      setSpeed((sp) => Math.max(50, Math.round(sp * 0.95)));

      // place new food not on snake
      setFood(randomFood(newSnake, ROWS, COLS));

      // update highscore
      setHighScore((h) => Math.max(h, score + 10));
    }
  }

  function randomFood(s: Pos[], rows: number, cols: number) {
    const occupied = new Set(s.map((p) => `${p.x},${p.y}`));
    const spots: Pos[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (!occupied.has(`${x},${y}`)) spots.push({ x, y });
      }
    }
    if (spots.length === 0) return { x: 0, y: 0 };
    return spots[Math.floor(Math.random() * spots.length)];
  }

  function start() {
    setSnake([{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }]);
    setDir({ x: 0, y: 0 });
    setFood(
      randomFood(
        [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }],
        ROWS,
        COLS
      )
    );
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setIsPlaying(true);
  }

  function endGame() {
    setIsPlaying(false);
    setGameOver(true);
    setDir({ x: 0, y: 0 });
    setHighScore((h) => Math.max(h, score));
  }

  function pause() {
    setIsPlaying(false);
  }

  function resume() {
    if (!gameOver) setIsPlaying(true);
  }

  // on-screen mobile controls helpers
  function handleTouchDir(next: Pos) {
    setDirSafe(next);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "linear-gradient(90deg, #FDBB2D 0%, #22C1C3 100%)" }}
    >
      <div className="max-w-2xl w-full">
        <div className="flex items-center justify-center mb-4 ">
            <Headline title="SNAKEMON"/>
        </div>

        <div
          style={{
            backgroundImage: 'url("/bgSnake.jpg")',
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
          className="p-4 rounded-lg shadow-xl flex flex-col items-center"
        >
          {/* controls/top */}
          <div className="w-full flex justify-between mb-3">
            {!isPlaying && !gameOver && (
              <button
                onClick={start}
                className="px-4 py-2 bg-teal-500 rounded-md text-black font-semibold"
              >
                Play
              </button>
            )}
            <div className="text-white">
              <div className="flex gap-1">
                <p>Score:</p>
                <p className="font-black">
                  <FlipNumbers
                    height={24}
                    width={18}
                    color="red"
                    background="transparent"
                    play
                    numbers={String(score)}
                  />
                </p>
              </div>
              <div className="text-xl text-gray-200">
                High:{" "}
                <span className="font-black text-blue-300">{highScore}</span>
              </div>
            </div>
            {isPlaying && (
              <div className="flex gap-2">
                <button
                  onClick={pause}
                  className="px-3 py-1 bg-yellow-300 rounded"
                >
                  Pause
                </button>
                <button
                  onClick={() => {
                    setSnake([
                      { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) },
                    ]);
                    setScore(0);
                  }}
                  className="px-3 py-1 bg-red-400 rounded"
                >
                  Reset
                </button>
              </div>
            )}

            {gameOver && (
              <div className="flex gap-2 items-center">
                <div className="text-red-500 font-black text-2xl">
                  Game Over
                </div>
                <button
                  onClick={start}
                  className="px-3 py-1 bg-teal-500 rounded"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>

          {/* grid */}
          <div
            className="grid bg-gray-900"
            style={{
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              width: "100%",
              aspectRatio: `${COLS} / ${ROWS}`,
              maxWidth: "520px",
            }}
          >
            {Array.from({ length: ROWS * COLS }).map((_, idx) => {
              const x = idx % COLS;
              const y = Math.floor(idx / COLS);
              const isHead = snake[0]?.x === x && snake[0]?.y === y;
              const isBody = snake.some(
                (s, i) => i > 0 && s.x === x && s.y === y
              );
              const isFood = food.x === x && food.y === y;

              return (
                <div key={idx} className={`border-[0.5px] border-gray-800`}>
                  <div
                    className={`w-full h-full ${
                      isHead
                        ? "bg-green-400"
                        : isBody
                        ? "bg-emerald-600"
                        : isFood
                        ? "bg-pink-500 animate-pulse"
                        : "bg-black"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* mobile controls */}
          <div className="w-full mt-4 sm:hidden flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <button
                onTouchStart={() => handleTouchDir({ x: 0, y: -1 })}
                onMouseDown={() => handleTouchDir({ x: 0, y: -1 })}
                className="px-4 py-2 bg-gray-700 rounded text-white"
              >
                <ChevronUp />
              </button>
            </div>
            <div className="flex gap-5">
              <button
                onTouchStart={() => handleTouchDir({ x: -1, y: 0 })}
                onMouseDown={() => handleTouchDir({ x: -1, y: 0 })}
                className="px-4 py-2 bg-gray-700 rounded text-white"
              >
                <ChevronLeft />
              </button>
              <button
                onTouchStart={() => handleTouchDir({ x: 1, y: 0 })}
                onMouseDown={() => handleTouchDir({ x: 1, y: 0 })}
                className="px-4 py-2 bg-gray-700 rounded text-white"
              >
                <ChevronRight />
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onTouchStart={() => handleTouchDir({ x: 0, y: 1 })}
                onMouseDown={() => handleTouchDir({ x: 0, y: 1 })}
                className="px-4 py-2 bg-gray-700 rounded text-white"
              >
                <ChevronDown />
              </button>
            </div>
          </div>

          {/* desktop controls */}
          <div className="hidden sm:flex gap-2 mt-4">
            <div className="text-sm text-gray-200">Use arrow keys or WASD</div>
          </div>
        </div>
      </div>
    </div>
  );
}
