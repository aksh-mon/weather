/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { JSX, useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Platform = {
  mesh: THREE.Mesh;
  w: number;
  h: number;
  alive: boolean;
};

type Obstacle = {
  mesh: THREE.Mesh;
  v: THREE.Vector3;
  alive: boolean;
};

export default function MountainClimber(): JSX.Element {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const playerRef = useRef<THREE.Mesh | null>(null);
  const platformsRef = useRef<Platform[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [avatarColor, setAvatarColor] = useState("#1f8fff");
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const keysRef = useRef({ left: false, right: false, jump: false });
  const audioCtxRef = useRef<AudioContext | null>(null);

  const WORLD_WIDTH = 12;
  const VIEW_HEIGHT = 12;

  const playBeep = (freq = 440, time = 0.05) => {
    try {
      if (!audioCtxRef.current)
        audioCtxRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      o.connect(g);
      g.connect(ctx.destination);
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.15, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + time);
      o.start(now);
      o.stop(now + time + 0.01);
    } catch {}
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const aspect = width / height;
    const cam = new THREE.OrthographicCamera(
      -WORLD_WIDTH * 0.5 * aspect,
      WORLD_WIDTH * 0.5 * aspect,
      VIEW_HEIGHT * 0.5,
      -VIEW_HEIGHT * 0.5,
      -100,
      1000
    );
    cam.position.set(0, 0, 100);
    cameraRef.current = cam;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfd1e5);
    sceneRef.current = scene;

    // Sharp peak mountain background
    const mountainGroup = new THREE.Group();
    const createPeakMountain = (offsetX: number, peakHeight: number) => {
      const points: THREE.Vector3[] = [];
      const baseW = 8;
      points.push(new THREE.Vector3(offsetX - baseW / 2, -VIEW_HEIGHT / 2, -10));
      points.push(
        new THREE.Vector3(offsetX, -VIEW_HEIGHT / 2 + peakHeight, -10)
      );
      points.push(new THREE.Vector3(offsetX + baseW / 2, -VIEW_HEIGHT / 2, -10));
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({ color: 0x000000 });
      mountainGroup.add(new THREE.Line(geom, mat));
    };
    createPeakMountain(-4, 8);
    createPeakMountain(4, 6);
    createPeakMountain(0, 10);
    scene.add(mountainGroup);

    // Player
    const playerGeo = new THREE.BoxGeometry(0.8, 1.4, 0.2);
    const playerMat = new THREE.MeshBasicMaterial({ color: avatarColor });
    const player = new THREE.Mesh(playerGeo, playerMat);
    player.position.set(0, -VIEW_HEIGHT / 2 + 1.2, 0);
    playerRef.current = player;
    scene.add(player);

    const headGeo = new THREE.CircleGeometry(0.33, 12);
    const headMat = new THREE.MeshBasicMaterial({ color: "#000000" });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 0.55, 0.1);
    player.add(head);

    const createPlatform = (x: number, y: number, w = 3) => {
      const g = new THREE.PlaneGeometry(w, 0.5);
      const m = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(x, y, 0);
      scene.add(mesh);
      platformsRef.current.push({ mesh, w, h: 0.5, alive: true });
    };

    for (let i = 0; i < 12; i++) {
      const x = (Math.random() - 0.5) * (WORLD_WIDTH - 2);
      const y = -VIEW_HEIGHT / 2 + 0.5 + i * 2.2;
      createPlatform(x, y, 2 + Math.random() * 3);
    }

    mountRef.current.appendChild(renderer.domElement);

    // Resize
    const onResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      rendererRef.current!.setSize(w, h);
      const aspect2 = w / h;
      cameraRef.current!.left = -WORLD_WIDTH * 0.5 * aspect2;
      cameraRef.current!.right = WORLD_WIDTH * 0.5 * aspect2;
      cameraRef.current!.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.clear();
    };
  }, [avatarColor]);

  // Run game loop only when playing
useEffect(() => {
  if (!isPlaying || !playerRef.current || !cameraRef.current) return;

  const player = playerRef.current;
  let vy = 0;                        // vertical velocity
  const gravity = -24;               // downward acceleration
  const moveSpeed = 5.5;
  const jumpSpeed = 10;
  let lastTime = performance.now();

  const animate = (now: number) => {
    const dt = Math.min((now - lastTime) / 1000, 0.05); // delta time
    lastTime = now;

    // Horizontal movement
    if (keysRef.current.left) player.position.x -= moveSpeed * dt;
    if (keysRef.current.right) player.position.x += moveSpeed * dt;

    // Jump
    if (keysRef.current.jump && Math.abs(vy) < 0.001) {
      vy = jumpSpeed;
      playBeep(880, 0.08);
    }

    // Gravity
    vy += gravity * dt;
    player.position.y += vy * dt;

    // Platform collisions (only when falling)
    if (vy <= 0) {
      for (const p of platformsRef.current) {
        const px = p.mesh.position.x;
        const py = p.mesh.position.y + 0.25;
        const halfW = p.w * 0.5;

        const withinX =
          player.position.x > px - halfW - 0.2 &&
          player.position.x < px + halfW + 0.2;
        const landing =
          player.position.y > py - 0.1 &&
          player.position.y < py + 0.6 &&
          player.position.y + vy * dt <= py;

        if (withinX && landing) {
          player.position.y = py; // land on platform
          vy = 0;                 // reset velocity
        }
      }
    }

    // Camera follows player upwards
    if (cameraRef.current) {
      const cam = cameraRef.current;
      const targetY = Math.max(cam.position.y, player.position.y + 3);
      cam.position.y += (targetY - cam.position.y) * Math.min(1, dt * 4);
    }

    // Update score based on height climbed
    setScore((s) => Math.max(s, Math.floor(player.position.y * 10)));

    // Render frame
    rendererRef.current?.render(
      sceneRef.current as THREE.Scene,
      cameraRef.current
    );

    if (isPlaying) requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}, [isPlaying]);

  // Start game
  const startGame = () => {
    if (!playerRef.current || !cameraRef.current) return;
    playerRef.current.position.set(0, -VIEW_HEIGHT / 2 + 1.2, 0);
    cameraRef.current.position.y = 0;
    setScore(0);
    setIsPlaying(true);
    playBeep(660, 0.06);
  };

  const controlDown = (name: keyof typeof keysRef.current) => {
    keysRef.current[name] = true;
  };
  const controlUp = (name: keyof typeof keysRef.current) => {
    keysRef.current[name] = false;
  };

  return (
    <div className="w-screen h-screen bg-[#eaeaea] relative text-black overflow-hidden">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="absolute top-3 left-3 z-40 text-sm">
        <div>
          Player: <strong>{playerName || "—"}</strong>
        </div>
        <div>
          Score: <strong>{Math.max(0, score)}</strong>
        </div>
      </div>

      <button
        onClick={() => setShowControls((s) => !s)}
        className="absolute top-3 right-3 z-40 bg-black/10 px-3 py-1 rounded text-sm md:hidden"
      >
        {showControls ? "Hide Controls" : "Show Controls"}
      </button>

      {showControls && (
        <div className="absolute bottom-6 left-0 right-0 z-50 flex items-end justify-between px-6 md:hidden">
          <div className="flex gap-3">
            <button
              onPointerDown={() => controlDown("left")}
              onPointerUp={() => controlUp("left")}
              className="w-14 h-14 rounded-full bg-black/10"
            >
              ◀
            </button>
            <button
              onPointerDown={() => controlDown("right")}
              onPointerUp={() => controlUp("right")}
              className="w-14 h-14 rounded-full bg-black/10"
            >
              ▶
            </button>
            <button
              onPointerDown={() => controlDown("jump")}
              onPointerUp={() => controlUp("jump")}
              className="w-14 h-14 rounded-full bg-black/10"
            >
              ⤒
            </button>
          </div>
          <div>
            <button
              onClick={() => startGame()}
              className="w-24 h-14 rounded-full bg-black/20"
            >
              Start
            </button>
          </div>
        </div>
      )}

      {!isPlaying && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="bg-white border rounded p-6 max-w-sm w-full text-center text-black">
            <h2 className="text-xl font-semibold mb-3">Mountain Climber</h2>
            <label className="block text-left text-sm">Player name</label>
            <input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full mt-2 mb-3 p-2 rounded border"
              placeholder="Your name"
            />
            <label className="block text-left text-sm mb-2">
              Choose avatar color
            </label>
            <div className="flex gap-2 justify-center mb-4">
              {["#1f8fff", "#ff6b6b", "#ffd166", "#6bffb3", "#000000"].map(
                (c) => (
                  <button
                    key={c}
                    onClick={() => setAvatarColor(c)}
                    style={{ background: c }}
                    className={`w-8 h-8 rounded-full border ${
                      avatarColor === c ? "ring-2 ring-black" : ""
                    }`}
                  />
                )
              )}
            </div>
            <button
              onClick={() => startGame()}
              className="px-4 py-2 rounded bg-black/10"
            >
              Start Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
