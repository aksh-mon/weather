/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect, useRef } from 'react';

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

const SHAPES = {
  I: [
    [[1], [1], [1], [1]],
    [[1, 1, 1, 1]],
  ],
  O: [
    [
      [1, 1],
      [1, 1],
    ],
  ],
  T: [
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    [
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [0, 1],
    ],
  ],
  L: [
    [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
    ],
    [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
    [
      [1, 1, 1],
      [1, 0, 0],
    ],
  ],
  J: [
    [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
    ],
    [
      [1, 1],
      [1, 0],
      [1, 0],
    ],
    [
      [1, 1, 1],
      [0, 0, 1],
    ],
  ],
  S: [
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
  ],
  Z: [
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 0],
    ],
  ],
};

const COLORS = ['#00FFFF', '#FFD700', '#FF00FF', '#FF4500', '#7CFC00', '#1E90FF', '#9400D3'];
const SHAPE_KEYS = Object.keys(SHAPES);

const getRandomShape = () => {
  const shape = SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)];
  const rotation = 0;
  return { shape, rotation };
};

const Tetris = () => {
  const [board, setBoard] = useState<number[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [current, setCurrent] = useState<any>(getRandomShape());
  const [position, setPosition] = useState({ row: 0, col: Math.floor(COLS / 2) - 1 });
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const shapeMatrix = SHAPES[current.shape][current.rotation % SHAPES[current.shape].length];

  const isValid = (r: number, c: number, shape: number[][] = shapeMatrix) => {
    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j]) {
          const newRow = r + i;
          const newCol = c + j;
          if (
            newRow < 0 || newRow >= ROWS ||
            newCol < 0 || newCol >= COLS ||
            board[newRow][newCol]
          ) return false;
        }
      }
    }
    return true;
  };

  const merge = () => {
    const newBoard = board.map(row => [...row]);
    for (let i = 0; i < shapeMatrix.length; i++) {
      for (let j = 0; j < shapeMatrix[i].length; j++) {
        if (shapeMatrix[i][j]) {
          const row = position.row + i;
          const col = position.col + j;
          newBoard[row][col] = SHAPE_KEYS.indexOf(current.shape) + 1;
        }
      }
    }
    clearLines(newBoard);
  };

  const clearLines = (newBoard: number[][]) => {
    const cleared = newBoard.filter(row => row.some(cell => cell === 0));
    const linesCleared = ROWS - cleared.length;
    const emptyRows = Array.from({ length: linesCleared }, () => Array(COLS).fill(0));
    const updatedBoard = [...emptyRows, ...cleared];
    if (linesCleared > 0) setScore(score + linesCleared * 10);
    setBoard(updatedBoard);
    setCurrent(getRandomShape());
    setPosition({ row: 0, col: Math.floor(COLS / 2) - 1 });

    if (!isValid(0, Math.floor(COLS / 2) - 1)) {
      alert("Game Over");
      window.location.reload();
    }
  };

  const moveDown = () => {
    if (isValid(position.row + 1, position.col)) {
      setPosition(prev => ({ ...prev, row: prev.row + 1 }));
    } else {
      merge();
    }
  };

  const moveLeft = () => {
    if (isValid(position.row, position.col - 1)) {
      setPosition(prev => ({ ...prev, col: prev.col - 1 }));
    }
  };

  const moveRight = () => {
    if (isValid(position.row, position.col + 1)) {
      setPosition(prev => ({ ...prev, col: prev.col + 1 }));
    }
  };

  const rotate = () => {
    const nextRotation = (current.rotation + 1) % SHAPES[current.shape].length;
    const nextShape = SHAPES[current.shape][nextRotation];
    if (isValid(position.row, position.col, nextShape)) {
      setCurrent(prev => ({ ...prev, rotation: nextRotation }));
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      moveDown();
    }, 500);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft': moveLeft(); break;
        case 'ArrowRight': moveRight(); break;
        case 'ArrowDown': moveDown(); break;
        case 'ArrowUp': rotate(); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const tempBoard = board.map(row => [...row]);
  for (let i = 0; i < shapeMatrix.length; i++) {
    for (let j = 0; j < shapeMatrix[i].length; j++) {
      if (shapeMatrix[i][j]) {
        const row = position.row + i;
        const col = position.col + j;
        if (row >= 0 && col >= 0 && row < ROWS && col < COLS) {
          tempBoard[row][col] = SHAPE_KEYS.indexOf(current.shape) + 1;
        }
      }
    }
  }

  return (
    <div className="flex flex-col items-center p-4 text-white">
      <div className="text-2xl font-bold mb-2">⏱ Time: {formatTime(timer)}</div>
      <div className="text-2xl font-bold mb-4">🏆 Score: {score}</div>
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(${ROWS}, ${BLOCK_SIZE}px)`,
          gridTemplateColumns: `repeat(${COLS}, ${BLOCK_SIZE}px)`,
        }}
      >
        {tempBoard.flat().map((cell, i) => (
          <div
            key={i}
            className="border border-gray-700"
            style={{
              width: BLOCK_SIZE,
              height: BLOCK_SIZE,
              backgroundColor: cell ? COLORS[cell - 1] : '#111',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Tetris;
