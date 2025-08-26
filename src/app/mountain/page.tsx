/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { JSX, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import confetti from "canvas-confetti";

/**
 * ClimbThreeGame.tsx
 *
 * Single-file Three.js climbing game with:
 * - 7 stages with different themes
 * - Obstacles (stone, sheep) that fall/approach
 * - Player moves up/down/left/right
 * - Navbar with name, volume, pause, save/load
 * - Loader between stages, confetti on clear
 * - Day/night switch (sun/moon + stars + birds)
 * - Mobile touch controls (buttons) for small screens
 *
 * Notes:
 * - Put this inside a client route/component in Next.js.
 * - Make sure three and canvas-confetti are installed.
 */

type ObstacleType = "stone" | "sheep" | "bird";

type StageDef = {
  id: number;
  name: string;
  steps: number; // number of up moves required
  baseObstacles: number;
  color: string; // background base color
  isNight?: boolean;
};

const STAGES: StageDef[] = [
  { id: 1, name: "Rocky Start", steps: 50, baseObstacles: 3, color: "#A6D8FF" },
  { id: 2, name: "Sunny Ridge", steps: 70, baseObstacles: 4, color: "#FFDDAA" },
  { id: 3, name: "Windy Edge", steps: 90, baseObstacles: 5, color: "#BFE7A7" },
  { id: 4, name: "Icy Ledge", steps: 110, baseObstacles: 6, color: "#DCEBFF" },
  { id: 5, name: "Storm Peak", steps: 150, baseObstacles: 7, color: "#B0B0C8", isNight: true },
  { id: 6, name: "Cloud Summit", steps: 200, baseObstacles: 8, color: "#EFEFEF" },
  { id: 7, name: "The Final Ascent", steps: 300, baseObstacles: 10, color: "#FFEECC", isNight: true },
];

export default function ClimbThreeGame(): JSX.Element {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // UI / control state
  const [playerName, setPlayerName] = useState<string>("");
  const [volume, setVolume] = useState<number>(0.5);
  const [paused, setPaused] = useState<boolean>(false);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const s = parseInt(localStorage.getItem("climb_stage_idx") || "0", 10);
      if (!isNaN(s)) return Math.min(Math.max(0, s), STAGES.length - 1);
    }
    return 0;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [loaderProgress, setLoaderProgress] = useState<number>(0);
  const [showClearMessage, setShowClearMessage] = useState<string | null>(null);
  const [dayMode, setDayMode] = useState<boolean>(true); // true = sun/day, false = moon/night
  const [mobileControls, setMobileControls] = useState<boolean>(false);

  // Refs used by game loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const playerRef = useRef<THREE.Mesh | null>(null);
  const obstaclesRef = useRef<Array<{ mesh: THREE.Mesh; type: ObstacleType; vy: number; vx: number }>>([]);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // gameplay state inside refs so animation loop sees latest without re-rendering
  const stepCountRef = useRef<number>(0); // how many 'up' moves performed in current stage
  const isGameOverRef = useRef<boolean>(false);

  // Helper: safe localStorage usage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("climb_name");
      if (savedName) setPlayerName(savedName);
      const savedVol = localStorage.getItem("climb_vol");
      if (savedVol) setVolume(parseFloat(savedVol));
      const savedMobile = localStorage.getItem("climb_mobile_controls");
      if (savedMobile) setMobileControls(savedMobile === "1");
      const savedDay = localStorage.getItem("climb_daymode");
      if (savedDay) setDayMode(savedDay === "1");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("climb_name", playerName);
      localStorage.setItem("climb_vol", String(volume));
      localStorage.setItem("climb_stage_idx", String(currentStageIdx));
      localStorage.setItem("climb_mobile_controls", mobileControls ? "1" : "0");
      localStorage.setItem("climb_daymode", dayMode ? "1" : "0");
    }
  }, [playerName, volume, currentStageIdx, mobileControls, dayMode]);

  // WebAudio helpers (small beep / success)
  const ensureAudioCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  };
  const playStepSound = (vol = 0.2, freq = 880, time = 0.06) => {
    try {
      const ctx = ensureAudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);
      const now = ctx.currentTime;
      g.gain.exponentialRampToValueAtTime(vol * volume, now + 0.01);
      o.start(now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + time);
      o.stop(now + time + 0.02);
    } catch (e) {
      /* ignore autoplay exceptions */
    }
  };
  const playClearSound = () => playStepSound(0.4, 600, 0.2);

  // Loader simulation (progress)
  useEffect(() => {
    setLoading(true);
    setLoaderProgress(0);
    let v = 0;
    const t = setInterval(() => {
      v += 8 + Math.random() * 12;
      setLoaderProgress((p) => {
        const np = Math.min(100, Math.floor(p + v / 10));
        if (np >= 100) {
          clearInterval(t);
          // short delay then hide loader
          setTimeout(() => setLoading(false), 600);
        }
        return np;
      });
    }, 200);
    return () => clearInterval(t);
  }, [currentStageIdx]);

  // Build / mount Three.js scene AFTER loader finished
  useEffect(() => {
    if (loading) return;
    if (!mountRef.current) return;

    // cleanup in case
    if (rendererRef.current) {
      try {
        mountRef.current.removeChild(rendererRef.current.domElement);
      } catch (e) {}
      rendererRef.current.dispose();
      sceneRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      playerRef.current = null;
      obstaclesRef.current = [];
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }

    // Scene + camera + renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 10, 24);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // set background (gradient-like): we use a color and add simple sun/moon as 2D sprite
    const stageDef = STAGES[currentStageIdx];
    scene.background = new THREE.Color(stageDef.color);

    // Basic lighting
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.7);
    hemi.position.set(0, 50, 0);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(10, 20, 10);
    dir.castShadow = true;
    scene.add(dir);

    // Mountains (several layered cones to give depth)
    for (let i = 0; i < 3; i++) {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(12 - i * 3, 30 - i * 4, 32),
        new THREE.MeshStandardMaterial({ color: shadeColor(stageDef.color, -10 * i) })
      );
      cone.position.y = -10 - i * 2;
      cone.receiveShadow = true;
      scene.add(cone);
    }

    // sun / moon: simple sphere far back
    const celestial = new THREE.Mesh(
      new THREE.SphereGeometry(3.0, 32, 32),
      new THREE.MeshBasicMaterial({ color: dayMode ? 0xffff66 : 0xddeeff })
    );
    celestial.position.set(-14, 18, -30);
    scene.add(celestial);

    // Stars for night: add small points
    const starGroup = new THREE.Group();
    if (!dayMode || stageDef.isNight) {
      for (let i = 0; i < 80; i++) {
        const s = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 6, 6),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        s.position.set((Math.random() - 0.5) * 60, Math.random() * 30 + 5, -40);
        starGroup.add(s);
      }
      scene.add(starGroup);
    }

    // Player (a capsule-like stacked geometry)
    const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1.8, 0.8), new THREE.MeshStandardMaterial({ color: 0x1f8fff }));
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    head.position.set(0, 1.1, 0);
    const player = new THREE.Group();
    player.add(body);
    player.add(head);
    player.position.set(0, -8, 0);
    playerRef.current = player as unknown as THREE.Mesh;
    scene.add(player);

    // ground plane for reference
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(80, 400), new THREE.MeshStandardMaterial({ color: shadeColor(stageDef.color, -40) }));
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -20;
    scene.add(plane);

    // create obstacles list
    obstaclesRef.current = [];
    const obstacleCount = stageDef.baseObstacles + currentStageIdx * 2;
    for (let i = 0; i < obstacleCount; i++) {
      spawnObstacle(scene, currentStageIdx);
    }

    // birds group (moving objects) shown in night or optionally always small number
    const birds: THREE.Mesh[] = [];
    if (!dayMode || stageDef.isNight) {
      for (let b = 0; b < 6; b++) {
        const bird = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.02), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        bird.position.set(-20 + Math.random() * 40, 5 + Math.random() * 20, -5);
        birds.push(bird);
        scene.add(bird);
      }
    }

    // window resize
    const onResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      rendererRef.current.setSize(w, h);
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // Input state (keyboard + touch)
    const input = { left: false, right: false, up: false, down: false };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") input.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") input.right = true;
      if (e.code === "ArrowUp" || e.code === "KeyW") input.up = true;
      if (e.code === "ArrowDown" || e.code === "KeyS") input.down = true;
      if (e.code === "Space") {
        // small upward hop and count it as a step
        player.position.y += 0.6;
        stepCountRef.current++;
        playStepSound();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") input.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") input.right = false;
      if (e.code === "ArrowUp" || e.code === "KeyW") input.up = false;
      if (e.code === "ArrowDown" || e.code === "KeyS") input.down = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Mobile touch buttons handlers will call these functions (exposed via closures)
    const doMove = (dir: "left" | "right" | "up" | "down") => {
      if (!playerRef.current) return;
      switch (dir) {
        case "left":
          playerRef.current.position.x -= 0.8;
          break;
        case "right":
          playerRef.current.position.x += 0.8;
          break;
        case "up":
          playerRef.current.position.y += 0.8;
          stepCountRef.current++;
          playStepSound();
          break;
        case "down":
          playerRef.current.position.y -= 0.8;
          break;
      }
    };

    // game loop
    isGameOverRef.current = false;
    stepCountRef.current = 0;

    const clock = new THREE.Clock();
    const tick = () => {
      if (paused || isGameOverRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(0.05, clock.getDelta());
      // compact movement: keyboard directional hold moves player
      if (input.left) player.position.x -= 6 * dt;
      if (input.right) player.position.x += 6 * dt;
      if (input.up) {
        player.position.y += 5 * dt;
        // count as continuous small steps when holding up
        if (Math.random() < 0.6 * dt) {
          stepCountRef.current++;
          playStepSound(0.12, 1000);
        }
      }
      if (input.down) player.position.y -= 5 * dt;

      // clamp
      player.position.x = Math.max(-12, Math.min(12, player.position.x));
      player.position.y = Math.max(-12, Math.min(80, player.position.y));

      // camera follows player
      camera.position.y += (player.position.y - camera.position.y) * 0.08;

      // move obstacles and detect collisions
      const stageDefNow = STAGES[currentStageIdx];
      for (const o of obstaclesRef.current) {
        // gravity or horizontal movement for birds
        if (o.type === "bird") {
          o.mesh.position.x += o.vx * dt;
          // loop horizontally
          if (o.mesh.position.x < -30) o.mesh.position.x = 30;
          if (o.mesh.position.x > 30) o.mesh.position.x = -30;
        } else {
          o.mesh.position.y -= o.vy * (1 + currentStageIdx * 0.08) * dt * 20;
          // respawn above camera view when below
          if (o.mesh.position.y < camera.position.y - 30) {
            o.mesh.position.y = camera.position.y + 30 + Math.random() * 20;
            o.mesh.position.x = (Math.random() - 0.5) * 24;
          }
        }
        // collision check (simple distance)
        const dist = o.mesh.position.distanceTo(player.position);
        if (dist < (o.type === "stone" ? 0.9 : 1.1)) {
          // hit
          isGameOverRef.current = true;
          // game over flow
          setTimeout(() => {
            alert(`You were hit by a ${o.type}. Game Over on stage "${stageDefNow.name}".`);
            // reset to stage start
            player.position.set(0, -8, 0);
            camera.position.y = 10;
            stepCountRef.current = 0;
            // optionally reset obstacles positions
            for (const oo of obstaclesRef.current) {
              oo.mesh.position.y = camera.position.y + 10 + Math.random() * 30;
            }
            isGameOverRef.current = false;
          }, 10);
          break;
        }
      }

      // birds animation
      for (const b of (scene.children as any)) {
        // nothing extra here; birds were handled as obstacles with type bird
      }

      // check stage completion (steps)
      const needed = STAGES[currentStageIdx].steps;
      if (stepCountRef.current >= needed) {
        // cleared stage
        playClearSound();
        confetti({ particleCount: 160, spread: 70, origin: { y: 0.6 } });
        setShowClearMessage(`You cleared: ${STAGES[currentStageIdx].name}`);
        // advance stage after a pause & show loader
        setTimeout(() => {
          setShowClearMessage(null);
          const next = currentStageIdx + 1 < STAGES.length ? currentStageIdx + 1 : 0;
          setCurrentStageIdx(next);
          localStorage.setItem("climb_stage_idx", String(next));
          // re-init loader for next stage
          setLoading(true);
        }, 1400);
      }

      // birds movement already applied via type bird vx

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      try {
        mountRef.current?.removeChild(renderer.domElement);
      } catch (e) {}
      renderer.dispose();
    };
  }, [loading, currentStageIdx, dayMode, paused]);

  // small helper functions used above
  function spawnObstacle(scene: THREE.Scene, stageIndex: number) {
    // choose type by probability (sheep less frequent)
    const rnd = Math.random();
    const type: ObstacleType = rnd < 0.6 ? "stone" : rnd < 0.9 ? "sheep" : "bird";
    let mesh: THREE.Mesh;
    let vy = 1 + Math.random() * 1.2;
    let vx = 0;
    if (type === "stone") {
      mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5 + Math.random() * 0.6, 10, 10), new THREE.MeshStandardMaterial({ color: 0x666666 }));
      mesh.castShadow = true;
    } else if (type === "sheep") {
      // sheep: box-ish fluff
      mesh = new THREE.Mesh(new THREE.BoxGeometry(0.9 + Math.random() * 0.6, 0.6 + Math.random() * 0.3, 0.6), new THREE.MeshStandardMaterial({ color: 0xffffff }));
      mesh.castShadow = true;
      vy = 0.6 + Math.random() * 0.6;
    } else {
      mesh = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.02), new THREE.MeshStandardMaterial({ color: 0xddddff }));
      vx = (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 1.4);
      mesh.position.set((Math.random() - 0.5) * 24, 10 + Math.random() * 20, -5);
    }
    // initial position relative to camera view - will be repositioned on spawn
    const camY = cameraRef.current ? cameraRef.current.position.y : 10;
    mesh.position.set((Math.random() - 0.5) * 24, camY + 10 + Math.random() * 40, 0);
    scene.add(mesh);
    obstaclesRef.current.push({ mesh, type, vy, vx });
  }

  // util: shade a hex color slightly (positive brighten, negative darken)
  function shadeColor(hex: string, percent: number) {
    // hex like #AABBCC
    const c = hex.replace("#", "");
    const num = parseInt(c, 16);
    let r = (num >> 16) + Math.round((percent * 255) / 100);
    let g = ((num >> 8) & 0x00ff) + Math.round((percent * 255) / 100);
    let b = (num & 0x0000ff) + Math.round((percent * 255) / 100);
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    return (("0" + (r | (g << 8) | (b << 16)).toString(16)).slice(-6));
  }

  // small UI handlers
  const togglePause = () => setPaused((p) => !p);
  const resetProgress = () => {
    stepCountRef.current = 0;
    localStorage.removeItem("climb_stage_idx");
    setCurrentStageIdx(0);
  };
  const toggleMobileControls = () => setMobileControls((m) => !m);
  const toggleDayNight = () => {
    setDayMode((d) => {
      const nd = !d;
      localStorage.setItem("climb_daymode", nd ? "1" : "0");
      return nd;
    });
  };

  // small touch handlers for mobile buttons — call doMove via dispatching custom event (simpler)
  const handleTouchMove = (dir: "left" | "right" | "up" | "down") => {
    // find playerRef and move directly
    if (!playerRef.current) return;
    switch (dir) {
      case "left":
        playerRef.current.position.x -= 0.9;
        break;
      case "right":
        playerRef.current.position.x += 0.9;
        break;
      case "up":
        playerRef.current.position.y += 0.9;
        stepCountRef.current++;
        playStepSound();
        break;
      case "down":
        playerRef.current.position.y -= 0.9;
        break;
    }
  };

  // main render HTML (navbar + canvas + mobile controls)
  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100">
      {/* NAVBAR */}
      <div className="flex items-center justify-between px-4 py-2 bg-white shadow z-30">
        <div className="flex items-center gap-3">
          <div className="font-bold text-lg">CLIMB</div>
          <div className="text-xs text-gray-600">Stage: <strong>{STAGES[currentStageIdx].name}</strong></div>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Your name"
            className="px-2 py-1 border rounded text-sm"
          />
          <label className="flex items-center gap-2 text-sm">
            Vol
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </label>
          <button onClick={toggleDayNight} className="px-3 py-1 bg-gray-200 rounded">Theme: {dayMode ? "Sun" : "Moon"}</button>
          <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 800); }} className="px-3 py-1 bg-blue-500 text-white rounded">Reload Stage</button>
          <button onClick={togglePause} className="px-3 py-1 bg-yellow-300 rounded">{paused ? "Resume" : "Pause"}</button>
          <button onClick={resetProgress} className="px-3 py-1 bg-red-300 rounded">Reset</button>
        </div>
      </div>

      {/* Loader or Canvas mount */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-200 to-gray-400 z-10">
            <div className="text-2xl font-bold mb-4">Loading Stage: {STAGES[currentStageIdx].name}</div>
            <div className="w-64 h-4 bg-white rounded overflow-hidden shadow">
              <div className="h-4 bg-green-500" style={{ width: `${loaderProgress}%`, transition: "width 180ms linear" }} />
            </div>
            <div className="mt-2 text-sm text-gray-700">Preparing terrain, animals & wind…</div>
          </div>
        ) : null}

        <div ref={mountRef} className="w-full h-full" />

        {/* Center clear message */}
        {showClearMessage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 text-black p-6 rounded-lg shadow-lg text-center">
              <div className="text-xl font-bold">{showClearMessage}</div>
              <div className="text-sm mt-2">Get ready for the next stage…</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer: stage progress + mobile toggle */}
      <div className="px-4 py-2 bg-white flex items-center justify-between text-sm">
        <div>Player: <strong>{playerName || "—"}</strong> | Stage {currentStageIdx + 1}/{STAGES.length} | Steps: {stepCountRef.current}/{STAGES[currentStageIdx].steps}</div>
        <div>
          <label className="mr-4"><input type="checkbox" checked={mobileControls} onChange={() => setMobileControls(!mobileControls)} /> Show mobile controls</label>
        </div>
      </div>

      {/* Mobile controls overlay (shown when toggled or on small screens) */}
      {mobileControls && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-3 z-40 md:hidden">
          <button onPointerDown={() => handleTouchMove("left")} className="p-4 bg-white rounded-full shadow">◀</button>
          <div className="flex flex-col gap-2">
            <button onPointerDown={() => handleTouchMove("up")} className="p-4 bg-white rounded-full shadow">▲</button>
            <button onPointerDown={() => handleTouchMove("down")} className="p-4 bg-white rounded-full shadow">▼</button>
          </div>
          <button onPointerDown={() => handleTouchMove("right")} className="p-4 bg-white rounded-full shadow">▶</button>
        </div>
      )}
    </div>
  );
}
