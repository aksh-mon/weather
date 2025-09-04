/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

// Navbar Component
function Navbar({ sound, setSound, paused, setPaused, theme, setTheme, playerName, setPlayerName }: any) {
  return (
    <div className="fixed top-0 left-0 w-full bg-gray-800 text-white flex justify-between items-center p-2 z-50">
      <div className="font-bold text-lg">⛰️ Climb Quest</div>
      <div className="flex items-center gap-3">
        <input
          className="px-2 py-1 text-black rounded"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Player Name"
        />
        <button
          onClick={() => setSound(!sound)}
          className="px-3 py-1 bg-blue-600 rounded"
        >
          {sound ? "🔊 Sound On" : "🔇 Sound Off"}
        </button>
        <button
          onClick={() => setPaused(!paused)}
          className="px-3 py-1 bg-yellow-600 rounded"
        >
          {paused ? "▶ Resume" : "⏸ Pause"}
        </button>
        <button
          onClick={() => setTheme(theme === "day" ? "night" : "day")}
          className="px-3 py-1 bg-purple-600 rounded"
        >
          {theme === "day" ? "🌙 Night" : "☀ Day"}
        </button>
      </div>
    </div>
  );
}

// Modal
function StageModal({ show, onClose, stage }: any) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 shadow-xl text-center w-96"
      >
        <h1 className="text-2xl font-bold">🎉 Stage {stage} Cleared!</h1>
        <p className="mt-2">Get ready for Stage {stage + 1}...</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
}

export default function ClimbGame() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [sound, setSound] = useState(true);
  const [theme, setTheme] = useState<"day" | "night">("day");
  const [stage, setStage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Player
    const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.set(0, -5, 0);
    scene.add(player);

    // Mountains
    const mountainGeometry = new THREE.ConeGeometry(5, 10, 32);
    const mountainMaterial = new THREE.MeshBasicMaterial({
      color: theme === "day" ? 0x8b4513 : 0x444444,
    });
    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountain.position.set(0, -10, -5);
    scene.add(mountain);

    // Lights (day/night)
    const ambientLight = new THREE.AmbientLight(theme === "day" ? 0xffffff : 0x333366);
    scene.add(ambientLight);

    camera.position.z = 15;

    let keys: any = {};
    let animationId: number;

    const animate = () => {
      if (!paused) {
        if (keys["ArrowUp"]) player.position.y += 0.1;
        if (keys["ArrowDown"]) player.position.y -= 0.1;
        if (keys["ArrowLeft"]) player.position.x -= 0.1;
        if (keys["ArrowRight"]) player.position.x += 0.1;

        if (player.position.y >= 5) {
          // Stage clear
          setModalOpen(true);
          confetti();
          setStage((prev) => prev + 1);
          player.position.y = -5;
        }
      }
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleKeyDown = (e: KeyboardEvent) => (keys[e.key] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keys[e.key] = false);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      cancelAnimationFrame(animationId);
      mountRef.current?.removeChild(renderer.domElement);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [paused, theme]);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <Navbar
        sound={sound}
        setSound={setSound}
        paused={paused}
        setPaused={setPaused}
        theme={theme}
        setTheme={setTheme}
      />
      <div ref={mountRef} className="w-full h-full bg-sky-300" />
      <StageModal
        show={modalOpen}
        stage={stage - 1}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
