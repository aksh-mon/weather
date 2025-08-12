
"use client";
import { MapPin } from "lucide-react";
import React, { JSX, useState } from "react";

// Track type
type Track = { r: number; c: number }[];

type Pawn = { position: "base" | number | "home" };

export default function LudoBoard() {
  const size = 15;

  // Create distinct pawn objects for each player (4 players x 4 pawns)
  const [pawns, setPawns] = useState<Pawn[][]>(() =>
    Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () => ({ position: "base" as const }))
    )
  );

  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1 | 2 | 3>(0);
  const [hasRolled, setHasRolled] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const colors = ["bg-red-500", "bg-green-500", "bg-yellow-400", "bg-blue-500"];
  const playerNames = ["Red", "Green", "Yellow", "Blue"];

  // Tracks: clockwise path approximating classic Ludo on a 15x15 grid
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
      { r: 0, c: 7 },
      { r: 0, c: 8 },
      { r: 1, c: 8 },
      { r: 2, c: 8 },
      { r: 3, c: 8 },
      { r: 4, c: 8 },
      { r: 5, c: 8 },
      { r: 6, c: 9 },
      { r: 6, c: 10 },
      { r: 6, c: 11 },
      { r: 6, c: 12 },
      { r: 6, c: 13 },
      { r: 6, c: 14 },
      { r: 7, c: 14 },
      { r: 8, c: 14 },
      { r: 8, c: 13 },
      { r: 8, c: 12 },
      { r: 8, c: 11 },
      { r: 8, c: 10 },
      { r: 8, c: 9 },
      { r: 9, c: 8 },
      { r: 10, c: 8 },
      { r: 11, c: 8 },
      { r: 12, c: 8 },
      { r: 13, c: 8 },
      { r: 14, c: 8 },
      { r: 14, c: 7 },
      { r: 14, c: 6 },
      { r: 13, c: 6 },
      { r: 12, c: 6 },
      { r: 11, c: 6 },
      { r: 10, c: 6 },
      { r: 9, c: 6 },
      { r: 8, c: 5 },
      { r: 8, c: 4 },
      { r: 8, c: 3 },
      { r: 8, c: 2 },
      { r: 8, c: 1 },
      { r: 8, c: 0 },
    ];
  }
  function makeTrackGreen(): Track {
    // offset so green's 'start' is top-left quadrant's exit towards the main path
    return [
      { r: 0, c: 8 },
      { r: 1, c: 8 },
      { r: 2, c: 8 },
      { r: 3, c: 8 },
      { r: 4, c: 8 },
      { r: 5, c: 8 },
      { r: 6, c: 9 },
      { r: 6, c: 10 },
      { r: 6, c: 11 },
      { r: 6, c: 12 },
      { r: 6, c: 13 },
      { r: 6, c: 14 },
      { r: 7, c: 14 },
      { r: 8, c: 14 },
      { r: 8, c: 13 },
      { r: 8, c: 12 },
      { r: 8, c: 11 },
      { r: 8, c: 10 },
      { r: 8, c: 9 },
      { r: 9, c: 8 },
      { r: 10, c: 8 },
      { r: 11, c: 8 },
      { r: 12, c: 8 },
      { r: 13, c: 8 },
      { r: 14, c: 8 },
      { r: 14, c: 7 },
      { r: 14, c: 6 },
      { r: 13, c: 6 },
      { r: 12, c: 6 },
      { r: 11, c: 6 },
      { r: 10, c: 6 },
      { r: 9, c: 6 },
      { r: 8, c: 5 },
      { r: 8, c: 4 },
      { r: 8, c: 3 },
      { r: 8, c: 2 },
      { r: 8, c: 1 },
      { r: 8, c: 0 },
      { r: 7, c: 0 },
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
  function makeTrackYellow(): Track {
    return makeTrackRed().slice(24).concat(makeTrackRed().slice(0, 24));
  }
  function makeTrackBlue(): Track {
    return makeTrackRed().slice(12).concat(makeTrackRed().slice(0, 12));
  }

  // helper: small delay for animation
  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

  // get list of pawn indices that can be moved for given player and roll
  const getMovablePawns = (playerIndex: number, steps: number) => {
    const list: number[] = [];
    const track = playerTracks[playerIndex as 0 | 1 | 2 | 3];
    pawns[playerIndex].forEach((pawn, i) => {
      if (pawn.position === "home") return;
      if (pawn.position === "base") {
        if (steps === 6) list.push(i);
      } else {
        const newPos = (pawn.position as number) + steps;
        if (newPos <= track.length) list.push(i);
      }
    });
    return list;
  };

  const advanceTurn = () => {
    setCurrentPlayer((p) => ((p + 1) % 4) as 0 | 1 | 2 | 3);
    setHasRolled(false);
    setDiceValue(null);
  };

  const rollDice = () => {
    if (hasRolled || isMoving) return; // prevent repeated rolls before move
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceValue(roll);
    setHasRolled(true);

    // if no pawn can move, auto-handle
    const movable = getMovablePawns(currentPlayer, roll);
    if (movable.length === 0) {
      // nothing to move — if roll is 6 allow re-roll, otherwise advance
      if (roll === 6) {
        // allow immediate re-roll: clear dice & hasRolled so player can roll again
        // small timeout so UI updates clearly
        setTimeout(() => {
          setHasRolled(false);
          setDiceValue(null);
        }, 300);
      } else {
        setTimeout(() => {
          advanceTurn();
        }, 300);
      }
    }
  };

  // move pawn with step-by-step animation
  const movePawn = async (
    playerIndex: number,
    pawnIndex: number,
    steps: number
  ) => {
    if (isMoving || !diceValue) return;
    setIsMoving(true);

    for (let step = 1; step <= steps; step++) {
      setPawns((prev) => {
        const copied = prev.map((arr) => arr.map((p) => ({ ...p })));
        const pawn = copied[playerIndex][pawnIndex];
        const track = playerTracks[playerIndex as 0 | 1 | 2 | 3];

        if (pawn.position === "base") {
          // first step moves from base onto track index 0
          pawn.position = 0;
        } else if (typeof pawn.position === "number") {
          const newPos = pawn.position + 1;
          if (newPos < track.length) pawn.position = newPos;
          else pawn.position = "home";
        }

        copied[playerIndex][pawnIndex] = pawn;
        return copied;
      });

      // small delay so movement looks like walking
      await wait(180);
    }

    // after moving, handle captures (landing on opponent pawns)
    setPawns((prev) => {
      const copied = prev.map((arr) => arr.map((p) => ({ ...p })));
      const movedPawn = copied[playerIndex][pawnIndex];
      const track = playerTracks[playerIndex as 0 | 1 | 2 | 3];

      if (typeof movedPawn.position === "number") {
        const coords = track[movedPawn.position];
        for (let p = 0; p < copied.length; p++) {
          if (p === playerIndex) continue;
          for (let i = 0; i < copied[p].length; i++) {
            const other = copied[p][i];
            if (typeof other.position === "number") {
              const ocoords = playerTracks[p as 0 | 1 | 2 | 3][other.position];
              if (
                ocoords &&
                coords &&
                ocoords.r === coords.r &&
                ocoords.c === coords.c
              ) {
                // capture — send opponent pawn back to base
                copied[p][i] = { position: "base" };
              }
            }
          }
        }
      }

      return copied;
    });

    // finishing logic: if rolled 6 stay same player (extra turn), otherwise advance
    const rolled = diceValue;
    setDiceValue(null);
    setIsMoving(false);

    if (rolled === 6) {
      // give another roll
      setHasRolled(false);
    } else {
      advanceTurn();
    }
  };

  const handlePawnClick = (playerIndex: number, pawnIndex: number) => {
    if (playerIndex !== currentPlayer) return;
    if (!diceValue) return;
    if (isMoving) return;

    const movable = getMovablePawns(playerIndex, diceValue);
    if (!movable.includes(pawnIndex)) return;

    // animate move
    void movePawn(playerIndex, pawnIndex, diceValue);
  };

  // build grid cells
  const cells: JSX.Element[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      let className = `bg-white border border-gray-400`;

      if (row < 6 && col < 6) className = `${colors[0]} border border-gray-400`;
      if (row < 6 && col > 8) className = `${colors[1]} border border-gray-400`;
      if (row > 8 && col < 6) className = `${colors[2]} border border-gray-400`;
      if (row > 8 && col > 8) className = `${colors[3]} border border-gray-400`;

      if (col === 7 && row < 6)
        className = `${colors[0]} border border-gray-400`;
      if (row === 7 && col > 8)
        className = `${colors[1]} border border-gray-400`;
      if (row === 7 && col < 6)
        className = `${colors[2]} border border-gray-400`;
      if (col === 7 && row > 8)
        className = `${colors[3]} border border-gray-400`;

      if (row >= 6 && row <= 8 && col >= 6 && col <= 8) {
        if (row < 7 && col < 7)
          className = `${colors[0]} border border-gray-400`;
        if (row < 7 && col > 7)
          className = `${colors[1]} border border-gray-400`;
        if (row > 7 && col < 7)
          className = `${colors[2]} border border-gray-400`;
        if (row > 7 && col > 7)
          className = `${colors[3]} border border-gray-400`;
      }

      // render pawns that belong to this cell
      const pawnsInCell: JSX.Element[] = [];
      pawns.forEach((playerPawns, pIndex) =>
        playerPawns.forEach((pawn, pawnIndex) => {
          if (pawn.position === "base") {
            const start = getBaseCoords(pIndex as 0 | 1 | 2 | 3, pawnIndex);
            if (start.r === row && start.c === col) {
              pawnsInCell.push(
                <button
                  key={`${pIndex}-${pawnIndex}`}
                  onClick={() => handlePawnClick(pIndex, pawnIndex)}
                  disabled={
                    !(pIndex === currentPlayer && !!diceValue && !isMoving)
                  }
                  className={`w-3/4 h-3/4 rounded-full shadow-md flex justify-center items-center ${
                    colors[pIndex]
                  } ${
                    pIndex === currentPlayer && !!diceValue && !isMoving
                      ? "ring-2 ring-white"
                      : ""
                  }`}
                >
                  <MapPin color="#fff" className="w-4 h-4" />
                </button>
              );
            }
          } else if (typeof pawn.position === "number") {
            const coords = playerTracks[pIndex as 0 | 1 | 2 | 3][pawn.position];
            if (coords && coords.r === row && coords.c === col) {
              pawnsInCell.push(
                <button
                  key={`${pIndex}-${pawnIndex}`}
                  onClick={() => handlePawnClick(pIndex, pawnIndex)}
                  disabled={
                    !(pIndex === currentPlayer && !!diceValue && !isMoving)
                  }
                  className={`w-3/4 h-3/4 rounded-full shadow-md flex justify-center items-center ${
                    colors[pIndex]
                  } ${
                    pIndex === currentPlayer && !!diceValue && !isMoving
                      ? "ring-2 ring-white"
                      : ""
                  }`}
                >
                  <MapPin color="#fff" className="w-4 h-4" />
                </button>
              );
            }
          }
        })
      );

      cells.push(
        <div
          key={`${row}-${col}`}
          className={`${className} w-full h-full flex items-center justify-center`}
        >
          <div className="flex gap-1 flex-wrap justify-center items-center">
            {pawnsInCell}
          </div>
        </div>
      );
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center h-screen p-4 "
      style={{
        background:
          " linear-gradient(90deg,rgba(217, 197, 20, 0.48) 9%, rgba(217, 197, 20, 1) 23%, rgba(20, 98, 217, 1) 44%, rgba(44, 207, 35, 1) 62%, rgba(224, 13, 13, 0.74) 84%)",
      }}
    >
      <div
        className={`grid `}
         style={{
          gridTemplateRows: `repeat(${size}, 1rem)`,
           gridTemplateColumns: `repeat(${size}, 1rem)`,
           boxShadow: "0 0 20px rgba(0,0,0,0.2)",
         }}
      >
        {cells}
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={rollDice}
          disabled={hasRolled || isMoving}
          className={`px-6 py-2 text-white rounded-lg shadow-md ${
            hasRolled || isMoving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          Roll Dice
        </button>
        {diceValue !== null && (
          <div className="text-lg font-bold">🎲 {diceValue}</div>
        )}
        <div className="text-lg font-semibold">
          Current Player: {playerNames[currentPlayer]}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-200">
        Click your pawns to move after rolling. You can roll only once per turn
        (unless you rolled a 6). Moves animate step-by-step and captures send
        opponent pawns back to base.
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
