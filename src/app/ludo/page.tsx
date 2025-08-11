/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { MapPin } from "lucide-react";
import React, { useState } from "react";
import Headline from "../compo/headline";

// Track type
type Track = { r: number; c: number }[];

export default function LudoBoard() {
  const size = 15;
  const cells = [];

  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1 | 2 | 3>(0);
  const [pawns, setPawns] = useState<
    {
      position: "base" | number | "home";
      trackIndex: number | null;
    }[][]
  >(
    Array(4)
      .fill(null)
      .map(() =>
        Array(4).fill({
          position: "base",
          trackIndex: null,
        })
      )
  );
  const [selectedPawn, setSelectedPawn] = useState<{
    player: number;
    index: number;
  } | null>(null);

  const colors = {
    red: "bg-red-500",
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    blue: "bg-blue-500",
    white: "bg-white",
  };
  const playerNames = ["Red", "Green", "Yellow", "Blue"];

  // simplified track paths
  const playerTracks: Record<0 | 1 | 2 | 3, Track> = {
    0: makeTrackRed(),
    1: makeTrackGreen(),
    2: makeTrackYellow(),
    3: makeTrackBlue(),
  };

  function makeTrackRed(): Track {
    return [
      { r: 6, c: 0 },
      { r: 6, c: 1 },
      { r: 6, c: 2 },
      { r: 6, c: 3 },
      { r: 6, c: 4 },
      { r: 6, c: 5 },
      { r: 5, c: 6 },
      { r: 4, c: 6 },
      { r: 3, c: 6 },
      { r: 2, c: 6 },
      { r: 1, c: 6 },
      { r: 0, c: 6 },
    ];
  }
  function makeTrackGreen(): Track {
    return [
      { r: 0, c: 8 },
      { r: 1, c: 8 },
      { r: 2, c: 8 },
      { r: 3, c: 8 },
      { r: 4, c: 8 },
      { r: 5, c: 8 },
      { r: 6, c: 9 },
      { r: 6, c: 10 },
    ];
  }
  function makeTrackYellow(): Track {
    return [
      { r: 8, c: 0 },
      { r: 8, c: 1 },
      { r: 8, c: 2 },
      { r: 8, c: 3 },
      { r: 8, c: 4 },
      { r: 8, c: 5 },
      { r: 9, c: 6 },
      { r: 10, c: 6 },
    ];
  }
  function makeTrackBlue(): Track {
    return [
      { r: 8, c: 14 },
      { r: 8, c: 13 },
      { r: 8, c: 12 },
      { r: 8, c: 11 },
      { r: 8, c: 10 },
      { r: 8, c: 9 },
      { r: 9, c: 8 },
      { r: 10, c: 8 },
    ];
  }

  const handleRollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceValue(roll);
    setSelectedPawn(null);
  };

  const handlePawnClick = (playerIndex: number, pawnIndex: number) => {
    if (playerIndex !== currentPlayer) return;
    if (!diceValue) return;

    setSelectedPawn({ player: playerIndex, index: pawnIndex });
    movePawn(playerIndex as 0 | 1 | 2 | 3, pawnIndex, diceValue);
  };

  const movePawn = (
    playerIndex: 0 | 1 | 2 | 3,
    pawnIndex: number,
    steps: number
  ) => {
    setPawns((prev) => {
      const updated = prev.map((arr) => [...arr]);
      const pawn = { ...updated[playerIndex][pawnIndex] };

      if (pawn.position === "base") {
        if (steps === 6) {
          pawn.position = 0;
          pawn.trackIndex = 0;
        }
      } else if (typeof pawn.position === "number") {
        const newPos = pawn.trackIndex! + steps;
        const track = playerTracks[playerIndex];
        if (newPos < track.length) {
          pawn.position = newPos;
          pawn.trackIndex = newPos;
        } else {
          pawn.position = "home";
        }
      }
      updated[playerIndex][pawnIndex] = pawn;
      return updated;
    });

    if (steps !== 6) {
      setCurrentPlayer((p) => ((p + 1) % 4) as 0 | 1 | 2 | 3);
    }
    setDiceValue(null);
  };

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      let className = `${colors.white} border border-gray-400`;

      if (row < 6 && col < 6) className = `${colors.red} border border-gray-400`;
      if (row < 6 && col > 8) className = `${colors.green} border border-gray-400`;
      if (row > 8 && col < 6) className = `${colors.yellow} border border-gray-400`;
      if (row > 8 && col > 8) className = `${colors.blue} border border-gray-400`;

      if (col === 7 && row < 6) className = `${colors.red} border border-gray-400`;
      if (row === 7 && col > 8) className = `${colors.green} border border-gray-400`;
      if (row === 7 && col < 6) className = `${colors.yellow} border border-gray-400`;
      if (col === 7 && row > 8) className = `${colors.blue} border border-gray-400`;

      if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
        if (row < 7 && col < 7) className = `${colors.red} border border-gray-400`;
        if (row < 7 && col > 7) className = `${colors.green} border border-gray-400`;
        if (row > 7 && col < 7) className = `${colors.yellow} border border-gray-400`;
        if (row > 7 && col > 7) className = `${colors.blue} border border-gray-400`;
      }

      cells.push(
        <div
          key={`${row}-${col}`}
          className={`${className} w-full h-full flex items-center justify-center`}
        >
          {pawns.map((playerPawns, pIndex) =>
            playerPawns.map((pawn, pawnIndex) => {
              if (pawn.position === "base") {
                const startCoords = getBaseCoords(pIndex as 0 | 1 | 2 | 3, pawnIndex);
                if (startCoords.r === row && startCoords.c === col) {
                  return (
                    <button
                      key={`${pIndex}-${pawnIndex}`}
                      onClick={() => handlePawnClick(pIndex, pawnIndex)}
                      className={`w-3/4 h-3/4 rounded-full shadow-md ${
                        Object.values(colors)[pIndex]
                      } flex justify-center items-center`}
                    >
                      <MapPin
                        className={`w-3/4 h-3/4 rounded-full shadow-md ${
                          Object.values(colors)[pIndex]
                        }`}
                      />
                    </button>
                  );
                }
              } else if (typeof pawn.position === "number") {
                const coords =
                  playerTracks[pIndex as 0 | 1 | 2 | 3][pawn.trackIndex!];
                if (coords.r === row && coords.c === col) {
                  return (
                    <button
                      key={`${pIndex}-${pawnIndex}`}
                      onClick={() => handlePawnClick(pIndex, pawnIndex)}
                      className={`w-3/4 h-3/4 rounded-full shadow-md ${
                        Object.values(colors)[pIndex]
                      } flex justify-center items-center`}
                    >
                      <MapPin color="#fff" className=" w-5 h-5 " />
                    </button>
                  );
                }
              }
              return null;
            })
          )}
        </div>
      );
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen  p-4 "
      style={{
        background:
          " linear-gradient(90deg,rgba(217, 197, 20, 0.48) 9%, rgba(217, 197, 20, 1) 23%, rgba(20, 98, 217, 1) 44%, rgba(44, 207, 35, 1) 62%, rgba(224, 13, 13, 0.74) 84%)",
      }}
    >
      <Headline title="ludomon" />
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(${size}, 2rem)`,
          gridTemplateColumns: `repeat(${size}, 2rem)`,
          boxShadow: "0 0 20px rgba(0,0,0,0.2)",
        }}
      >
        {cells}
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={handleRollDice}
          className="px-6 py-2 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600"
        >
          Roll Dice
        </button>
        {diceValue && <div className="text-lg font-bold">🎲 {diceValue}</div>}
        <div className="text-lg font-semibold">
          Current Player: {playerNames[currentPlayer]}
        </div>
      </div>
    </div>
  );
}

function getBaseCoords(playerIndex: 0 | 1 | 2 | 3, pawnIndex: number) {
  const baseLayouts = {
    0: [
      { r: 1, c: 1 },
      { r: 1, c: 4 },
      { r: 4, c: 1 },
      { r: 4, c: 4 },
    ],
    1: [
      { r: 1, c: 10 },
      { r: 1, c: 13 },
      { r: 4, c: 10 },
      { r: 4, c: 13 },
    ],
    2: [
      { r: 10, c: 1 },
      { r: 10, c: 4 },
      { r: 13, c: 1 },
      { r: 13, c: 4 },
    ],
    3: [
      { r: 10, c: 10 },
      { r: 10, c: 13 },
      { r: 13, c: 10 },
      { r: 13, c: 13 },
    ],
  } as Record<0 | 1 | 2 | 3, { r: number; c: number }[]>;
  return baseLayouts[playerIndex][pawnIndex];
}
