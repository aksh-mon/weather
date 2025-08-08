/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Rotate3DIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);

  const gravity = 0.6;
  const jumpStrength = -12;
  const dino = useRef({
    x: 50,
    y: 260,
    width: 40,
    height: 40,
    velocityY: 0,
    onGround: true,
  });
  const obstacles = useRef<
    { x: number; width: number; height: number; passed?: boolean }[]
  >([]);
  const frameRef = useRef(0);
  const dinoImageRef = useRef<HTMLImageElement | null>(null);
  const obstacleImageRef = useRef<HTMLImageElement | null>(null);

  // Detect orientation
  useEffect(() => {
    const checkOrientation = () => {
      const isLandscapeMode = window.matchMedia(
        "(orientation: landscape)"
      ).matches;
      setIsLandscape(isLandscapeMode);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLandscape) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dinoImg = new Image();
    dinoImg.src = "/fish.svg";
    dinoImageRef.current = dinoImg;

    const obstacleImg = new Image();
    obstacleImg.src = "/net.svg";
    obstacleImageRef.current = obstacleImg;

    let animationId: number;
    let currentScore = 0;

    const resizeCanvas = () => {
      const width = Math.min(window.innerWidth, 800);
      const height = Math.min(window.innerHeight, 300);
      canvas.width = width;
      canvas.height = height;
      dino.current.y = canvas.height - dino.current.height;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const drawDino = () => {
      if (dinoImageRef.current && dinoImageRef.current.complete) {
        ctx.drawImage(
          dinoImageRef.current,
          dino.current.x,
          dino.current.y,
          dino.current.width,
          dino.current.height
        );
      } else {
        ctx.fillStyle = "black";
        ctx.fillRect(
          dino.current.x,
          dino.current.y,
          dino.current.width,
          dino.current.height
        );
      }
    };

    const drawObstacles = () => {
      obstacles.current.forEach((ob) => {
        const y = canvas.height - ob.height;
        if (obstacleImageRef.current && obstacleImageRef.current.complete) {
          ctx.drawImage(obstacleImageRef.current, ob.x, y, ob.width, ob.height);
        } else {
          ctx.fillStyle = "red";
          ctx.fillRect(ob.x, y, ob.width, ob.height);
        }
      });
    };

    const drawScore = () => {
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText(`Score: ${currentScore}`, canvas.width / 2 - 40, 30);
    };

    const update = () => {
      if (!dino.current.onGround) {
        dino.current.velocityY += gravity;
        dino.current.y += dino.current.velocityY;

        if (dino.current.y >= canvas.height - dino.current.height) {
          dino.current.y = canvas.height - dino.current.height;
          dino.current.velocityY = 0;
          dino.current.onGround = true;
        }
      }

      if (frameRef.current % 100 === 0) {
        const height = 20 + Math.random() * 30;
        obstacles.current.push({ x: canvas.width, width: 20, height });
      }

      obstacles.current.forEach((ob) => {
        ob.x -= 6;

        if (!ob.passed && ob.x + ob.width < dino.current.x) {
          ob.passed = true;
          currentScore += 1;
        }
      });

      obstacles.current = obstacles.current.filter((ob) => ob.x + ob.width > 0);
    };

    const detectCollision = () => {
      for (const ob of obstacles.current) {
        const obTop = canvas.height - ob.height;
        if (
          dino.current.x < ob.x + ob.width &&
          dino.current.x + dino.current.width > ob.x &&
          dino.current.y + dino.current.height > obTop
        ) {
          return true;
        }
      }
      return false;
    };

    const gameLoop = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      update();
      drawDino();
      drawObstacles();
      drawScore();

      if (detectCollision()) {
        setIsRunning(false);
        setGameOver(true);
        setScore(currentScore);
        cancelAnimationFrame(animationId);
        return;
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    if (isRunning) {
      dino.current = {
        x: 50,
        y: 260,
        width: 40,
        height: 40,
        velocityY: 0,
        onGround: true,
      };
      obstacles.current = [];
      frameRef.current = 0;
      currentScore = 0;
      animationId = requestAnimationFrame(gameLoop);
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRunning, isLandscape]);

  const jump = () => {
    if (!isLandscape) return;

    if (!isRunning && !gameOver) {
      setIsRunning(true);
    } else if (gameOver) {
      setGameOver(false);
      setIsRunning(true);
    } else if (dino.current.onGround) {
      dino.current.velocityY = jumpStrength;
      dino.current.onGround = false;
    }
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center flex-col"
      style={{
        background:
          "linear-gradient(90deg, rgba(18,179,204,1) 28%, rgb(227,227,230) 50%, rgba(0,68,255,0.83) 96%)",
      }}
      onClick={jump}
    >
      {!isLandscape && (
        <div className="relative inset-0 w-full h-[100%] mt-[50%] text-white flex flex-col items-center justify-center px-6 text-center">
          <p
            className="text-2xl font-bold px-5"
            style={{
              background:
                "linear-gradient(90deg, rgba(18,179,204,1) 28%, rgb(227,227,230) 50%, rgba(0,68,255,0.83) 96%)",
              color: "rgba(210, 216, 217, 0.722)",
            }}
          >
            Please rotate <span className="ml-[45px]">your device</span>
          </p>
          <div className="p-2 rounded-full  bg-[linear-gradient(90deg,rgba(18,179,204,1)_28%,rgb(227,227,230)_50%,rgba(0,68,255,0.83)_96%)] inline-flex items-center justify-center">
            <Rotate3DIcon size={38} color="rgba(18,179,204,1)" className="animate-spin" />
          </div>

          <p
            className="text-xl"
            style={{
              background:
                "linear-gradient(90deg, rgba(18,179,204,1) 28%, rgb(227,227,230) 50%, rgba(0,68,255,0.83) 96%)",
              color: "rgba(210, 216, 217, 0.722)",
            }}
          >
            This game only works{" "}
            <span className="ml-[58px]">in landscape mode.</span>
          </p>
        </div>
      )}

      <h2
        className="text-[32px] px-2 mb-5"
        style={{
          background:
            "linear-gradient(90deg, rgba(18,179,204,1) 28%, rgb(227,227,230) 50%, rgba(0,68,255,0.83) 96%)",
          color: "rgba(210, 216, 217, 0.722)",
        }}
      >
        FISH - MON
      </h2>

      <div className="relative">
        <canvas
          ref={canvasRef}
          style={{
            background:
              "linear-gradient(90deg, rgba(18,179,204,1) 28%, rgb(227,227,230) 50%, rgba(0,68,255,0.83) 96%)",
            maxWidth: "100%",
          }}
        />
        {!isRunning && !gameOver && isLandscape && (
          <div className="absolute inset-0 flex items-center justify-center text-black text-lg font-bold bg-white bg-opacity-70">
            Click or press Space/↑ to Start & Jump
          </div>
        )}
        {gameOver && isLandscape && (
          <div className="absolute inset-0 flex items-center justify-center flex-col text-black text-2xl font-bold bg-blue-300 bg-opacity-90">
            <p>Game Over</p>
            <p className="text-lg mt-2">Score: {score}</p>
            <p className="text-sm mt-4">Click or press Space/↑ to Restart</p>
          </div>
        )}
      </div>
    </div>
  );
}
