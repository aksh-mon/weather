/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import confetti from "canvas-confetti";

export default function ClimbGame() {
 const mountRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<number>(1);
  const [playerName, setPlayerName] = useState<string>("Player");

  // ✅ Initialize from localStorage only in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStage = localStorage.getItem("climb_stage");
      const savedName = localStorage.getItem("climb_name");
      if (savedStage) setStage(parseInt(savedStage));
      if (savedName) setPlayerName(savedName);
    }
  }, []);

  // ✅ Save progress only in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("climb_stage", stage.toString());
      localStorage.setItem("climb_name", playerName);
    }
  }, [stage, playerName]);

  // Stage definitions
  const stages = [
    { id: 1, steps: 300, name: "Rocky Start", color: "#6b4226" },
    { id: 2, steps: 400, name: "Icy Heights", color: "#88ccee" },
    { id: 3, steps: 500, name: "Windy Edge", color: "#99cc55" },
    { id: 4, steps: 600, name: "Frozen Cliffs", color: "#ccccff" },
    { id: 5, steps: 700, name: "Storm Peak", color: "#555577" },
    { id: 6, steps: 800, name: "Cloud Summit", color: "#dddddd" },
    { id: 7, steps: 1000, name: "The Final Ascent", color: "#ffcc88" },
  ];

  // Audio
  useEffect(() => {
    const audio = new Audio(
      "https://cdn.pixabay.com/download/audio/2022/03/15/audio_0a97ab8e77.mp3?filename=epic-ambient-111397.mp3"
    );
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(() => {}); // ignore autoplay block
    return () => audio.pause();
  }, []);

  // Setup Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;
    camera.position.y = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 10);
    scene.add(light);

    // Mountain (just colored plane for now)
    const geometry = new THREE.ConeGeometry(5, 20, 32);
    const material = new THREE.MeshStandardMaterial({
      color: stages[stage - 1].color,
      flatShading: true,
    });
    const mountain = new THREE.Mesh(geometry, material);
    scene.add(mountain);

    // Player
    const playerGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const playerMaterial = new THREE.MeshStandardMaterial({ color: "red" });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.set(0, -9, 0);
    scene.add(player);

    // Obstacles
    const obstacles: THREE.Mesh[] = [];
    for (let i = 0; i < 10; i++) {
      const o = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshStandardMaterial({ color: "black" })
      );
      o.position.set((Math.random() - 0.5) * 5, Math.random() * 15 - 5, 0);
      scene.add(o);
      obstacles.push(o);
    }

    let climbing = true;
    let climbedSteps = 0;

    // Touch controls
    function handleTouch(e: TouchEvent) {
      if (climbing) {
        player.position.y += 0.3; // climb step
        climbedSteps++;
      }
    }
    window.addEventListener("touchstart", handleTouch);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Obstacle falling
      obstacles.forEach((o) => {
        o.position.y -= 0.05;
        if (o.position.y < -10) {
          o.position.y = 10;
          o.position.x = (Math.random() - 0.5) * 5;
        }
        // Collision check
        if (player.position.distanceTo(o.position) < 0.5) {
          climbing = false;
          alert("You got hit! Try again.");
          player.position.y = -9;
          climbedSteps = 0;
          climbing = true;
        }
      });

      // Stage completion
      if (climbedSteps >= stages[stage - 1].steps) {
        confetti();
        let nextStage = stage + 1;
        if (nextStage > stages.length) {
          alert("🎉 You completed all stages! The End.");
          nextStage = 1;
        }
        setStage(nextStage);
        localStorage.setItem("climb_stage", nextStage.toString());
        climbedSteps = 0;
        player.position.y = -9;
      }

      renderer.render(scene, camera);
    }
    animate();

    setTimeout(() => setLoading(false), 2000); // fake loading

    return () => {
      window.removeEventListener("touchstart", handleTouch);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [stage]);

  return (
    <div className="w-screen h-screen bg-black text-white flex items-center justify-center">
      {loading ? (
        <h1 className="text-3xl animate-pulse">CLIMB - Loading resources...</h1>
      ) : (
        <div ref={mountRef} className="w-full h-full"></div>
      )}
    </div>
  );
}
