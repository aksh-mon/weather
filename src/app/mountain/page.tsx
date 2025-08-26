/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function StarGame() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [nameInput, setNameInput] = useState("");

  // Handle start game
  const handleStart = () => {
    if (nameInput.trim() !== "") {
      setPlayerName(nameInput.trim());
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (!mountRef.current || !isPlaying) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Gradient background (mountain-like)
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, "#0f2027"); // top dark
    gradient.addColorStop(0.5, "#203a43"); // middle bluish
    gradient.addColorStop(1, "#2c5364"); // bottom
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, 256);
    scene.background = new THREE.CanvasTexture(canvas);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Player cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    const player = new THREE.Mesh(geometry, material);
    scene.add(player);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    // Stars
    const starGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = 0; i < 200; i++) {
      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        -Math.random() * 50
      );
      scene.add(star);
    }

    // Movement
    const keys: Record<string, boolean> = {};
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Animate
    const animate = () => {
      if (!isPlaying) return;

      if (keys["ArrowUp"]) player.position.y += 0.05;
      if (keys["ArrowDown"]) player.position.y -= 0.05;
      if (keys["ArrowLeft"]) player.position.x -= 0.05;
      if (keys["ArrowRight"]) player.position.x += 0.05;

      // Update score (distance travelled upwards)
      setScore((s) => Math.max(s, Math.floor(player.position.y * 10)));

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (rendererRef.current) {
        mountRef.current?.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [isPlaying]);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-gray-900">
      {!isPlaying ? (
        <div className="p-6 rounded-2xl bg-white shadow-xl text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">Star Game 🚀</h1>
          <input
            type="text"
            placeholder="Enter your name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
          <button
            onClick={handleStart}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <div
            ref={mountRef}
            className="w-full h-full"
          />
          <div className="absolute top-4 left-4 bg-white/70 px-4 py-2 rounded-lg shadow-lg">
            <p className="font-semibold text-gray-800">{playerName}</p>
            <p className="text-sm text-gray-600">Score: {score}</p>
          </div>
        </div>
      )}
    </div>
  );
}
