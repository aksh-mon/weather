/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowBigLeft,
  RotateCcw,
  ArrowBigRight,
  ArrowBigDownDash,
  PlayCircle,
} from 'lucide-react';

const ROWS = 20;
const COLS = 10;
const CELL_SIZE = 8; // Tailwind size unit = 2rem

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
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sounds
  const rotateSound = useRef<HTMLAudioElement | null>(null);
  const moveSound = useRef<HTMLAudioElement | null>(null);
  const dropSound = useRef<HTMLAudioElement | null>(null);
  const gameOverSound = useRef<HTMLAudioElement | null>(null);

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
      if (rotateShape) rotateSound.current?.play();
      else if (dy === 0) moveSound.current?.play();
    } else if (dy > 0 && !rotateShape) {
      const merged = merge(current.shape, grid, current.x, current.y);
      const newGrid = merged.filter((row) => row.some((cell) => cell === 0));
      const cleared = ROWS - newGrid.length;
      while (newGrid.length < ROWS) newGrid.unshift(Array(COLS).fill(0));
      setGrid(newGrid);
      const next = randomShape();
      if (collides(next.shape, next.x, next.y)) {
        setIsGameOver(true);
        gameOverSound.current?.play();
        clearInterval(intervalRef.current!);
      } else {
        setCurrent(next);
      }
      dropSound.current?.play();
    }
  };

  const drop = () => move(0, 1);
  const left = () => move(-1, 0);
  const right = () => move(1, 0);
  const rotateBlock = () => move(0, 0, true);
  const fastDrop = () => move(0, 1);

  const startGame = () => {
    setIsStarted(true);
    setIsGameOver(false);
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setCurrent(randomShape());
    setStartTime(Date.now());
    setElapsed(0);
  };

  useEffect(() => {
    if (!isStarted || isGameOver) return;

    const handleKey = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowLeft':
          left();
          break;
        case 'ArrowRight':
          right();
          break;
        case 'ArrowDown':
          fastDrop();
          break;
        case 'ArrowUp':
          rotateBlock();
          break;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [current, isStarted, isGameOver]);

  useEffect(() => {
    if (!isStarted || isGameOver) return;

    intervalRef.current = setInterval(() => {
      drop();
      setElapsed(Math.floor((Date.now() - (startTime ?? Date.now())) / 1000));
    }, 800);

    return () => clearInterval(intervalRef.current!);
  }, [current, isStarted, startTime, isGameOver]);

  const displayGrid = merge(current.shape, grid, current.x, current.y);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <div className="relative flex flex-col items-center mt-8 gap-4">
      <h1 className="text-4xl font-bold text-purple-700 tracking-widest">TETRIS</h1>
      <div className="text-lg font-mono text-gray-800">
        ⏱️ Time: {minutes}m {seconds}s
      </div>

      {/* Tetris Grid */}
      <div
        className="grid gap-[1px] bg-gray-400 p-1 border-4 border-gray-800 rounded"
        style={{ gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE * 4}px)` }}
      >
        {displayGrid.flat().map((cell, i) => (
          <div
            key={i}
            className={`w-${CELL_SIZE} h-${CELL_SIZE} ${
              cell ? 'bg-green-400' : 'bg-white'
            }`}
          />
        ))}
      </div>

      {/* Game Over Message */}
      {isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-red-600 text-3xl font-bold animate-pulse z-10">
          💀 Game Over!
        </div>
      )}

      {/* Start Button */}
      {!isStarted && !isGameOver && (
        <button
          onClick={startGame}
          className="bg-purple-700 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-purple-900 transition"
        >
          <PlayCircle /> Start Game
        </button>
      )}

      {/* Mobile Controls */}
      {isStarted && !isGameOver && (
        <div className="flex gap-3 mt-6 md:hidden">
          <button className="bg-gray-700 text-white p-3 rounded" onClick={left}>
            <ArrowBigLeft color="#fff" />
          </button>
          <button className="bg-gray-700 text-white p-3 rounded" onClick={rotateBlock}>
            <RotateCcw color="#fff" />
          </button>
          <button className="bg-gray-700 text-white p-3 rounded" onClick={fastDrop}>
            <ArrowBigDownDash color="#fff" />
          </button>
          <button className="bg-gray-700 text-white p-3 rounded" onClick={right}>
            <ArrowBigRight color="#fff" />
          </button>
        </div>
      )}

      {/* Audio elements */}
      <audio ref={rotateSound} src="/rotate.wav" />
      <audio ref={moveSound} src="/move.wav" />
      <audio ref={dropSound} src="/drop.wav" />
      <audio ref={gameOverSound} src="/gameover.mp3" />
    </div>
  );
};

export default TetrisGame;
