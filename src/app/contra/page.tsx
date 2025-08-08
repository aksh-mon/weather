// Complete Tetris game with working timer (minutes & seconds), score, and mobile-friendly controls
import React, { useState, useEffect, useRef } from 'react';

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  L: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  J: [
    [0, 0, 1],
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
};

const COLORS = {
  I: 'cyan',
  O: 'yellow',
  T: 'purple',
  L: 'orange',
  J: 'blue',
  S: 'green',
  Z: 'red',
};

const getRandomPiece = () => {
  const keys = Object.keys(SHAPES);
  const rand = keys[Math.floor(Math.random() * keys.length)];
  return { shape: SHAPES[rand], type: rand, x: 3, y: 0 };
};

const Tetris = () => {
  const [grid, setGrid] = useState(Array(ROWS).fill().map(() => Array(COLS).fill(null)));
  const [piece, setPiece] = useState(getRandomPiece());
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => movePiece(0, 1), 700);
    intervalRef.current = interval;
    return () => clearInterval(interval);
  }, [piece, gameOver]);

  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const rotate = shape => {
    return shape[0].map((_, i) => shape.map(row => row[i])).reverse();
  };

  const isValidMove = (shape, offsetX, offsetY) => {
    return shape.every((row, y) =>
      row.every((cell, x) => {
        if (!cell) return true;
        const newX = piece.x + x + offsetX;
        const newY = piece.y + y + offsetY;
        return (
          newX >= 0 &&
          newX < COLS &&
          newY >= 0 &&
          newY < ROWS &&
          !grid[newY][newX]
        );
      })
    );
  };

  const mergePiece = () => {
    const newGrid = grid.map(row => [...row]);
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) newGrid[piece.y + y][piece.x + x] = piece.type;
      });
    });
    return newGrid;
  };

  const clearLines = newGrid => {
    const filtered = newGrid.filter(row => row.some(cell => !cell));
    const clearedLines = ROWS - filtered.length;
    setScore(prev => prev + clearedLines * 100);
    return Array(clearedLines).fill(Array(COLS).fill(null)).concat(filtered);
  };

  const movePiece = (dx, dy) => {
    if (gameOver) return;
    const newX = piece.x + dx;
    const newY = piece.y + dy;
    if (isValidMove(piece.shape, dx, dy)) {
      setPiece({ ...piece, x: newX, y: newY });
    } else if (dy === 1) {
      const newGrid = mergePiece();
      const clearedGrid = clearLines(newGrid);
      const next = getRandomPiece();
      if (!isValidMove(next.shape, 0, 0)) {
        setGameOver(true);
        clearInterval(intervalRef.current);
      } else {
        setGrid(clearedGrid);
        setPiece(next);
      }
    }
  };

  const hardDrop = () => {
    while (isValidMove(piece.shape, 0, 1)) {
      setPiece(prev => ({ ...prev, y: prev.y + 1 }));
    }
  };

  const handleKeyDown = e => {
    if (gameOver) return;
    switch (e.key) {
      case 'ArrowLeft':
        movePiece(-1, 0);
        break;
      case 'ArrowRight':
        movePiece(1, 0);
        break;
      case 'ArrowDown':
        movePiece(0, 1);
        break;
      case ' ': // Spacebar
        hardDrop();
        break;
      case 'ArrowUp':
        const rotated = rotate(piece.shape);
        if (isValidMove(rotated, 0, 0)) setPiece({ ...piece, shape: rotated });
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const drawGrid = () => {
    const display = grid.map(row => [...row]);
    piece.shape.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell && piece.y + y >= 0) display[piece.y + y][piece.x + x] = piece.type;
      });
    });
    return display;
  };

  const formattedTime = `${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60)
    .toString()
    .padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-4">Tetris</h1>
      <div className="text-lg mb-2">Time: {formattedTime}</div>
      <div className="text-lg mb-2">Score: {score}</div>
      {gameOver && <div className="text-red-500 font-bold">Game Over</div>}
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(${ROWS}, ${BLOCK_SIZE}px)`,
          gridTemplateColumns: `repeat(${COLS}, ${BLOCK_SIZE}px)`,
          gap: 1,
          backgroundColor: '#333',
        }}
      >
        {drawGrid().map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
                backgroundColor: cell ? COLORS[cell] : '#111',
              }}
            />
          ))
        )}
      </div>

      {/* Mobile Controls */}
      <div className="mt-4 flex gap-4">
        <button onClick={() => movePiece(-1, 0)} className="p-2 bg-gray-700 rounded">⬅️</button>
        <button onClick={() => movePiece(0, 1)} className="p-2 bg-gray-700 rounded">⬇️</button>
        <button onClick={() => movePiece(1, 0)} className="p-2 bg-gray-700 rounded">➡️</button>
        <button
          onClick={() => {
            const rotated = rotate(piece.shape);
            if (isValidMove(rotated, 0, 0)) setPiece({ ...piece, shape: rotated });
          }}
          className="p-2 bg-gray-700 rounded"
        >
          🔄
        </button>
        <button onClick={hardDrop} className="p-2 bg-gray-700 rounded">⏬</button>
      </div>
    </div>
  );
};

export default Tetris;
