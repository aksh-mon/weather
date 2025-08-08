/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState, useRef } from 'react';

const ROWS = 20;
const COLS = 10;

const TETROMINOES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

const getRandomTetromino = () => {
  const keys = Object.keys(TETROMINOES);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return { shape: TETROMINOES[randomKey], name: randomKey };
};

const TetrisGame = () => {
  const [grid, setGrid] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [current, setCurrent] = useState(getRandomTetromino());
  const [pos, setPos] = useState({ row: 0, col: 3 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  const merge = (baseGrid: any[], shape: any[], position: { row: any; col: any; }) => {
    const newGrid = baseGrid.map(row => [...row]);
    shape.forEach((r, i) => {
      r.forEach((val: any, j: any) => {
        if (val) {
          const x = position.row + i;
          const y = position.col + j;
          if (x >= 0 && x < ROWS && y >= 0 && y < COLS) {
            newGrid[x][y] = 1;
          }
        }
      });
    });
    return newGrid;
  };

  const checkCollision = (shape: any[], position: { row: any; col: any; }) => {
    return shape.some((r, i) =>
      r.some((val: any, j: any) => {
        if (val) {
          const x = position.row + i;
          const y = position.col + j;
          return x >= ROWS || y < 0 || y >= COLS || (x >= 0 && grid[x][y]);
        }
        return false;
      })
    );
  };

  const rotate = (matrix) => matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());

  const handleMove = (dir) => {
    if (isGameOver) return;
    const newPos = { ...pos };
    if (dir === 'left') newPos.col -= 1;
    if (dir === 'right') newPos.col += 1;
    if (dir === 'down') newPos.row += 1;
    if (!checkCollision(current.shape, newPos)) {
      setPos(newPos);
    } else if (dir === 'down') {
      const newGrid = merge(grid, current.shape, pos);
      clearRows(newGrid);
      const next = getRandomTetromino();
      const startPos = { row: 0, col: 3 };
      if (checkCollision(next.shape, startPos)) {
        setIsGameOver(true);
        clearInterval(intervalRef.current);
      } else {
        setCurrent(next);
        setPos(startPos);
        setGrid(newGrid);
      }
    }
  };

  const clearRows = (gridToCheck: any[]) => {
    const newGrid = [];
    let cleared = 0;
    for (let i = 0; i < ROWS; i++) {
      if (gridToCheck[i].every((val: number) => val === 1)) {
        cleared++;
        newGrid.unshift(Array(COLS).fill(0));
      } else {
        newGrid.push(gridToCheck[i]);
      }
    }
    if (cleared > 0) {
      setScore(score + cleared * 100);
      setGrid(newGrid);
    }
  };

  const handleRotate = () => {
    const rotated = rotate(current.shape);
    if (!checkCollision(rotated, pos)) {
      setCurrent({ ...current, shape: rotated });
    }
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
      handleMove('down');
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (isGameOver) return;
    if (e.key === 'ArrowLeft') handleMove('left');
    else if (e.key === 'ArrowRight') handleMove('right');
    else if (e.key === 'ArrowDown') handleMove('down');
    else if (e.key === 'ArrowUp') handleRotate();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    startTimer();
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(intervalRef.current);
    };
  }, []);

  const renderGrid = () => {
    const displayGrid = merge(grid, current.shape, pos);
    return displayGrid.map((row, i) => (
      <div key={i} className="flex">
        {row.map((cell, j) => (
          <div
            key={j}
            className={`w-6 h-6 border border-gray-400 ${
              cell ? 'bg-blue-500' : 'bg-white'
            }`}
          />
        ))}
      </div>
    ));
  };

  const formatTime = () => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">🧩 Tetris Game</h1>
      <div className="text-lg mb-2">🕒 Time: {formatTime()}</div>
      <div className="text-lg mb-2">🏆 Score: {score}</div>
      {isGameOver && (
        <div className="text-red-500 font-bold text-xl mt-2">Game Over</div>
      )}
      <div className="bg-gray-200 p-2 rounded-md">{renderGrid()}</div>

      {/* Mobile controls */}
      <div className="flex sm:hidden gap-2 mt-4">
        <button onClick={() => handleMove('left')} className="bg-blue-600 px-3 py-2 rounded">←</button>
        <button onClick={() => handleMove('down')} className="bg-blue-600 px-3 py-2 rounded">↓</button>
        <button onClick={() => handleMove('right')} className="bg-blue-600 px-3 py-2 rounded">→</button>
        <button onClick={handleRotate} className="bg-yellow-500 px-3 py-2 rounded">⤾</button>
      </div>
    </div>
  );
};

export default TetrisGame;
