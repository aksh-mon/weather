/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { JSX, useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Single-file Next.js + TypeScript + Three.js mobile-first shooter game
// - Responsive canvas
// - Fullscreen on tap/click
// - Landscape friendly (shows rotate hint in portrait)
// - Mobile touch controls (left/right/jump/shoot)
// - Player can walk, jump, shoot; obstacles spawn and move toward player
// - Type-safe (basic) and only depends on three

type Bullet = {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  alive: boolean;
};

type Obstacle = {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  alive: boolean;
};

export default function CubeShooterPage(): JSX.Element {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const playerRef = useRef<THREE.Mesh | null>(null);
  const bulletsRef = useRef<Bullet[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const keysRef = useRef({ left: false, right: false, jump: false, shooting: false });
  const lastShotRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);
  const clockRef = useRef<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(true);

  // Helpers
  function requestFullscreen(elem: HTMLElement) {
    const el: any = elem;
    const request = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (request) request.call(el);
  }

  useEffect(() => {
    const handleOrientation = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIsLandscape(w >= h);
    };
    handleOrientation();
    window.addEventListener("resize", handleOrientation);
    return () => window.removeEventListener("resize", handleOrientation);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    rendererRef.current = renderer;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1020);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 12);
    cameraRef.current = camera;

    // Lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemi.position.set(0, 20, 0);
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(-5, 10, 5);
    scene.add(dir);

    // Ground
    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x0f1724 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);

    // Player
    const playerGeo = new THREE.BoxGeometry(1, 2, 1);
    const playerMat = new THREE.MeshStandardMaterial({ color: 0x1f8fff });
    const player = new THREE.Mesh(playerGeo, playerMat);
    player.position.set(0, 1, 0);
    playerRef.current = player;
    scene.add(player);

    // Camera follow offset
    const camOffset = new THREE.Vector3(0, 5, 12);

    // Add renderer dom
    mountRef.current.appendChild(renderer.domElement);

    // Resizing helper
    const onResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      rendererRef.current.setSize(w, h);
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
    };

    window.addEventListener("resize", onResize);

    // Simple physics & controls state
    let vy = 0; // vertical velocity
    const gravity = -30;
    const moveSpeed = 8;
    const jumpSpeed = 12;

    // Game loop
    let lastTime = performance.now();
    let animationId = 0;

    function spawnObstacle(now: number) {
      // spawn every 900ms-ish, adjust with difficulty
      if (now - lastSpawnRef.current < 900) return;
      lastSpawnRef.current = now;

      const size = 0.8 + Math.random() * 1.6;
      const geo = new THREE.BoxGeometry(size, size, size);
      const mat = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
      const obs = new THREE.Mesh(geo, mat);

      // spawn in front with random lateral position
      const lateral = (Math.random() - 0.5) * 10;
      obs.position.set(lateral, size / 2, -40);
      scene.add(obs);

      const speed = 6 + Math.random() * 4 + Math.min(score / 30, 6);
      obstaclesRef.current.push({ mesh: obs, velocity: new THREE.Vector3(0, 0, speed), alive: true });
    }

    function shootBullet() {
      const now = performance.now();
      if (now - lastShotRef.current < 220) return; // fire rate
      lastShotRef.current = now;

      if (!playerRef.current || !sceneRef.current) return;
      const bgeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
      const bmat = new THREE.MeshStandardMaterial({ color: 0xfff59d });
      const bmesh = new THREE.Mesh(bgeo, bmat);
      const forward = new THREE.Vector3(0, 0, -1);
      bmesh.position.copy(playerRef.current.position).add(new THREE.Vector3(0, 0.6, -1.2));
      sceneRef.current.add(bmesh);

      const velocity = forward.multiplyScalar(40);
      bulletsRef.current.push({ mesh: bmesh, velocity, alive: true });
    }

    function loop(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Controls: move horizontally
      if (playerRef.current) {
        let dx = 0;
        if (keysRef.current.left) dx -= moveSpeed;
        if (keysRef.current.right) dx += moveSpeed;
        playerRef.current.position.x += dx * dt;
        // clamp
        playerRef.current.position.x = Math.max(Math.min(playerRef.current.position.x, 9.5), -9.5);

        // Jump
        if (keysRef.current.jump && Math.abs(vy) < 0.0001) {
          vy = jumpSpeed;
        }

        vy += gravity * dt; // integrate
        playerRef.current.position.y += vy * dt;
        if (playerRef.current.position.y < 1) {
          playerRef.current.position.y = 1;
          vy = 0;
        }
      }

      // Shooting
      if (keysRef.current.shooting) shootBullet();

      // Update bullets
      for (const b of bulletsRef.current) {
        if (!b.alive) continue;
        b.mesh.position.addScaledVector(b.velocity, dt);
        if (b.mesh.position.z < -120) {
          b.alive = false;
          scene.remove(b.mesh);
        }
      }
      bulletsRef.current = bulletsRef.current.filter((b) => b.alive);

      // Spawn obstacles
      spawnObstacle(now);

      // Update obstacles
      for (const o of obstaclesRef.current) {
        if (!o.alive) continue;
        // move toward positive z (player is near z=0)
        o.mesh.position.z += o.velocity.z * dt * 1;
        // slight side wobble
        o.mesh.position.x += Math.sin(now * 0.002 + o.mesh.id) * 0.01;

        // if passes player
        if (o.mesh.position.z > 6) {
          // remove and penalize
          o.alive = false;
          scene.remove(o.mesh);
          setLives((l) => Math.max(0, l - 1));
        }
      }
      obstaclesRef.current = obstaclesRef.current.filter((o) => o.alive);

      // Bullet vs Obstacle collision
      for (const b of bulletsRef.current) {
        for (const o of obstaclesRef.current) {
          if (!b.alive || !o.alive) continue;
          const dist = b.mesh.position.distanceTo(o.mesh.position);
          if (dist < 1.0 + (o.mesh.scale.x || 1)) {
            // hit
            b.alive = false;
            o.alive = false;
            scene.remove(b.mesh);
            scene.remove(o.mesh);
            setScore((s) => s + 10);
          }
        }
      }

      // Player vs Obstacle collision
      if (playerRef.current) {
        for (const o of obstaclesRef.current) {
          const dist = playerRef.current.position.distanceTo(o.mesh.position);
          if (dist < 1.6 + (o.mesh.scale.x || 1)) {
            // hit
            o.alive = false;
            scene.remove(o.mesh);
            setLives((l) => Math.max(0, l - 1));
          }
        }
      }

      // Camera follow
      if (cameraRef.current && playerRef.current) {
        const target = playerRef.current.position.clone().add(camOffset);
        cameraRef.current.position.lerp(target, 0.08);
        cameraRef.current.lookAt(playerRef.current.position.x, playerRef.current.position.y + 1, playerRef.current.position.z - 6);
      }

      // Difficulty: remove older bullets/obstacles handled above

      // Render
      renderer.render(scene, camera);

      // Game over check
      if (lives <= 0) {
        // stop loop and show a quick flicker
        // reset game state after short pause
        cancelAnimationFrame(animationId);
        setTimeout(() => {
          // reset
          setLives(3);
          setScore(0);
          // clear objects
          for (const b of bulletsRef.current) scene.remove(b.mesh);
          for (const o of obstaclesRef.current) scene.remove(o.mesh);
          bulletsRef.current = [];
          obstaclesRef.current = [];
          lastSpawnRef.current = performance.now();
          lastShotRef.current = 0;
          lastTime = performance.now();
          animationId = requestAnimationFrame(loop);
        }, 900);
        return;
      }

      animationId = requestAnimationFrame(loop);
    }

    lastTime = performance.now();
    lastSpawnRef.current = performance.now();
    animationId = requestAnimationFrame(loop);

    // Keyboard controls for desktop
    const keyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.key === "a") keysRef.current.left = true;
      if (e.code === "ArrowRight" || e.key === "d") keysRef.current.right = true;
      if (e.code === "Space") keysRef.current.jump = true;
      if (e.code === "KeyK" || e.code === "ControlLeft") keysRef.current.shooting = true;
      // fullscreen on Enter
      if (e.code === "Enter" && mountRef.current) requestFullscreen(mountRef.current);
    };
    const keyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.key === "a") keysRef.current.left = false;
      if (e.code === "ArrowRight" || e.key === "d") keysRef.current.right = false;
      if (e.code === "Space") keysRef.current.jump = false;
      if (e.code === "KeyK" || e.code === "ControlLeft") keysRef.current.shooting = false;
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    // Touch / pointer controls
    const handlePointerDown = (e: PointerEvent) => {
      // if user taps the canvas area, toggle fullscreen
      if (!mountRef.current) return;
      // only trigger when user taps near center area (so UI buttons still work separately)
      const rect = renderer.domElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // if tap in center region -> fullscreen
      if (x > rect.width * 0.25 && x < rect.width * 0.75 && y > rect.height * 0.15 && y < rect.height * 0.85) {
        try {
          requestFullscreen(mountRef.current);
          setIsFullscreen(true);
        } catch (err) {
          // ignore
        }
      }
    };
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      scene.clear();
    };
  }, [lives, score]); // re-run effect when lives / score changes to let reset mechanics work

  // On-screen control handlers (for mobile)
  const controlDown = (name: keyof typeof keysRef.current) => {
    keysRef.current[name] = true;
  };
  const controlUp = (name: keyof typeof keysRef.current) => {
    keysRef.current[name] = false;
  };

  return (
    <div className="w-screen h-screen bg-slate-900 text-white overflow-hidden relative flex items-center justify-center" style={{ touchAction: "none" }}>
      {/* Rotate hint for portrait screens */}
      {!isLandscape && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 text-center p-4">
          <div className="text-2xl font-bold mb-2">Rotate your device</div>
          <div className="max-w-xs">This game plays best in landscape mode. Rotate your device for the full experience.</div>
        </div>
      )}

      <div ref={mountRef} className="w-full h-full" style={{ maxHeight: "100vh" }} />

      {/* HUD */}
      <div className="absolute top-3 left-3 z-40 flex items-center gap-4">
        <div className="bg-black/50 px-3 py-1 rounded">Score: <strong>{score}</strong></div>
        <div className="bg-black/50 px-3 py-1 rounded">Lives: <strong>{lives}</strong></div>
      </div>

      {/* Mobile controls - bottom overlay */}
      <div className="absolute bottom-4 left-0 right-0 z-50 flex items-end justify-between px-6 md:px-12">
        <div className="flex gap-3 items-center">
          <button
            onPointerDown={() => controlDown("left")}
            onPointerUp={() => controlUp("left")}
            onPointerLeave={() => controlUp("left")}
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center font-bold"
            aria-label="left"
          >
            ◀
          </button>
          <button
            onPointerDown={() => controlDown("right")}
            onPointerUp={() => controlUp("right")}
            onPointerLeave={() => controlUp("right")}
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center font-bold"
            aria-label="right"
          >
            ▶
          </button>
          <button
            onPointerDown={() => controlDown("jump")}
            onPointerUp={() => controlUp("jump")}
            onPointerLeave={() => controlUp("jump")}
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center font-bold"
            aria-label="jump"
          >
            ⤒
          </button>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onPointerDown={() => controlDown("shooting")}
            onPointerUp={() => controlUp("shooting")}
            onPointerLeave={() => controlUp("shooting")}
            className="w-20 h-14 rounded-full bg-red-600/90 text-white font-semibold"
            aria-label="shoot"
          >
            SHOOT
          </button>
        </div>
      </div>

      {/* small footer hint */}
      <div className="absolute bottom-2 right-2 z-40 text-xs text-white/60">Tap center to go fullscreen</div>
    </div>
  );
}
