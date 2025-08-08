/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Eraser } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type NumberGrid = number[][];

const EMPTY_GRID: NumberGrid = Array(9)
  .fill(0)
  .map(() => Array(9).fill(0));

const LEVEL_BLANKS = {
  Easy: 30,
  Medium: 45,
  Hard: 55,
} as const;

const Sudoku = () => {
  const [grid, setGrid] = useState<NumberGrid>(EMPTY_GRID);
  const [solution, setSolution] = useState<NumberGrid>(EMPTY_GRID);
  const [puzzle, setPuzzle] = useState<NumberGrid>(EMPTY_GRID);
  const [level, setLevel] = useState<keyof typeof LEVEL_BLANKS>("Easy");
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [timer, setTimer] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showWinMessage, setShowWinMessage] = useState(true);

  const colors = [
    "#0ff", // Cyan
    "#ff0", // Yellow
    "#0f0", // Lime
    "#f80", // Orange
    "#3296ff", // Sky Blue
    "#39ff14", // Neon Green
    "#ff073a", // Neon Red
    "#ff6ec7", // Neon Pink
    "#fe019a", // Bright Pink
    "#00ffff", // Aqua
    "#ffcc00", // Bright Yellow
    "#ff0090", // Hot Pink
    "#ff9933", // Orange-ish
    "#00ffcc", // Bright Turquoise
    "#ffd1dc", // Light Pink
    "#c1f0f6", // Light Aqua
    "#f9f871", // Light Yellow
    "#caffb9", // Mint
    "#e0bbff", // Lavender
    "#ffdab9", // Peach Puff
    "#add8e6", // Light Blue
    "#f0e68c", // Khaki
    "#7f00ff", // Purple
    "#e100ff", // Electric Violet
    "#00c9ff", // Sky Blue
    "#92fe9d", // Light Green
    "#f7971e", // Orange Peel
    "#ffd200", // Golden
    "#2b5876",
    "#4e4376",
    "#1e3c72",
    "#2a5298",
    "#232526",
    "#414345",
  ];
  const [colorIndex, setColorIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    startColorCycle();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startColorCycle = () => {
    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setColorIndex((prev) => (prev + 1) % colors.length);
      }
    }, 3000);
  };

  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
  };
  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted]);

  const isSafe = (
    grid: NumberGrid,
    row: number,
    col: number,
    num: number
  ): boolean => {
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num || grid[x][col] === num) return false;
    }

    const startRow = row - (row % 3);
    const startCol = col - (col % 3);
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[startRow + i][startCol + j] === num) return false;

    return true;
  };

  const fillGrid = (grid: NumberGrid): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const numbers = [...Array(9).keys()]
            .map((i) => i + 1)
            .sort(() => Math.random() - 0.5);
          for (const num of numbers) {
            if (isSafe(grid, row, col, num)) {
              grid[row][col] = num;
              if (fillGrid(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const generatePuzzle = () => {
    const fullGrid = JSON.parse(JSON.stringify(EMPTY_GRID));
    fillGrid(fullGrid);
    setSolution(fullGrid.map((row: any) => [...row]));

    const puzzleCopy = fullGrid.map((row: any) => [...row]);
    const blanks = LEVEL_BLANKS[level];
    let removed = 0;

    while (removed < blanks) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (puzzleCopy[row][col] !== 0) {
        puzzleCopy[row][col] = 0;
        removed++;
      }
    }

    setPuzzle(puzzleCopy.map((row: any) => [...row]));
    setGrid(puzzleCopy);
    setIsStarted(true);
    setIsCompleted(false);
    setTimer(0);
  };

  const isPuzzleComplete = () => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] !== solution[r][c]) return false;
      }
    }
    return true;
  };

  const handleInput = (val: number) => {
    if (!selectedCell) return;
    const [row, col] = selectedCell;
    if (puzzle[row][col] !== 0) return; // Not editable

    const updated = grid.map((r) => [...r]);
    updated[row][col] = val;
    setGrid(updated);

    if (isPuzzleComplete()) {
      setIsCompleted(true);
      setIsStarted(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className="flex flex-col items-center gap-4 p-4  justify-center bg- font-mono relative h-full"
      style={{
        fontFamily: "monospace",
        backgroundColor: colors[28],
        textShadow: `0 0 10px ${colors[colorIndex]}, 0 0 20px ${colors[colorIndex]}`,
      }}
    >
      <div className="flex justify-between items-center w-full max-w-md">
        <select
          className="p-2 border rounded"
          value={level}
          onChange={(e) =>
            setLevel(e.target.value as keyof typeof LEVEL_BLANKS)
          }
        >
          {Object.keys(LEVEL_BLANKS).map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={generatePuzzle}
        >
          Play
        </button>
        <span className="font-mono">{formatTime(timer)}</span>
      </div>
      <h2
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="text-4xl uppercase tracking-[.5rem] font-light  transition-all duration-300 bg-amber-50 p-2 text-center rounded-3xl"
        style={{
          color: colors[colorIndex],
          textShadow: `0 0 10px ${colors[colorIndex]}, 0 0 20px ${colors[colorIndex]}`,
        }}
      >
        Sudoku
      </h2>
      <div className="grid grid-cols-9 border-2 border-black bg-white">
        {grid.map((row, r) =>
          row.map((val, c) => {
            const isSelected =
              selectedCell?.[0] === r && selectedCell?.[1] === c;
            const isSameNum =
              selectedCell &&
              grid[selectedCell[0]][selectedCell[1]] === val &&
              val !== 0;
            const isEditable = puzzle[r][c] === 0;

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => setSelectedCell([r, c])}
                className={`w-10 h-10 flex items-center justify-center cursor-pointer text-lg border border-gray-400 ${
                  isSelected ? "bg-yellow-300" : ""
                } ${isSameNum ? "bg-blue-200" : ""} ${
                  isEditable
                    ? grid[r][c] === solution[r][c]
                      ? "text-black font-bold"
                      : "text-red-600 font-bold"
                    : "text-black"
                }`}
                style={{
                  borderRight:
                    c === 2 || c === 5 ? "3px solid black" : undefined,
                  borderBottom:
                    r === 2 || r === 5 ? "3px solid black" : undefined,
                }}
              >
                {val !== 0 ? val : ""}
              </div>
            );
          })
        )}
      </div>
      <h2
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="text-4xl uppercase tracking-[.5rem] font-light  transition-all duration-300 bg-amber-50 p-2 text-center rounded-3xl"
        style={{
          color: colors[colorIndex],
          textShadow: `0 0 10px ${colors[colorIndex]}, 0 0 20px ${colors[colorIndex]}`,
        }}
      >
        Sudoku
      </h2>
      <div className="grid grid-cols-10 gap-2 mt-4">
        {[...Array(9).keys()].map((i) => (
          <button
            key={i}
            className="w-10 h-10 bg-gray-300 text-black hover:bg-gray-400 rounded"
            onClick={() => handleInput(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="w-full h-10 bg-red-500 text-white font-bold rounded hover:bg-red-600 flex justify-center items-center"
          onClick={() => handleInput(0)}
        >
          <Eraser />
        </button>
      </div>
      {isCompleted && showWinMessage && (
        <div className="bg-white px-6 py-8 rounded-3xl text-center text-3xl font-bold text-black animate-pulse shadow-xl max-w-xs relative">
          🎉 You Won! 🎉
          <br />
          Completed in <span className="underline">{formatTime(timer)}</span>
          <button
            onClick={() => setShowWinMessage(false)}
            className="absolute top-2 right-2 text-black text-sm border border-black px-2 py-1 rounded hover:bg-black hover:text-white transition"
          >
            ✕
          </button>
        </div>
      )}      
    </div>
  );
};

export default Sudoku;
