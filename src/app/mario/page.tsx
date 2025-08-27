/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Mario‑style platformer built with Three.js
 * — Desktop: WASD / Arrow keys (Space to jump)
 * — Mobile: on‑screen controls
 * — Click/tap canvas to toggle fullscreen
 * — Parallax background, coins, enemies, flag (win), sounds
 * — Responsive to all screen sizes
 *
 * Notes:
 * - No copyrighted Nintendo assets are used. Geometric shapes + colors only.
 */
export default function Platformer3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const playerRef = useRef<THREE.Mesh | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const worldObjectsRef = useRef<{
    ground: THREE.Mesh[];
    platforms: THREE.Mesh[];
    coins: THREE.Mesh[];
    enemies: { mesh: THREE.Mesh; dir: number; left: number; right: number }[];
    flag: THREE.Mesh | null;
    bgLayers: THREE.Mesh[];
  }>({ ground: [], platforms: [], coins: [], enemies: [], flag: null, bgLayers: [] });

  const keysRef = useRef<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ui, setUi] = useState({ coins: 0, status: "", hint: "" });

  // Simple audio via WebAudio API (tiny beeps)
  const audioCtxRef = useRef<AudioContext | null>(null);
  function playBeep(freq: number, duration = 0.1, type: OscillatorType = "square", vol = 0.06) {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = vol;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  // Fullscreen helpers
  function enterFullscreen(el: HTMLElement) {
    const anyEl = el as any;
    if (anyEl.requestFullscreen) anyEl.requestFullscreen();
    else if (anyEl.webkitRequestFullscreen) anyEl.webkitRequestFullscreen();
    else if (anyEl.msRequestFullscreen) anyEl.msRequestFullscreen();
  }
  function exitFullscreen() {
    const d: any = document;
    if (document.exitFullscreen) document.exitFullscreen();
    else if (d.webkitExitFullscreen) d.webkitExitFullscreen();
    else if (d.msExitFullscreen) d.msExitFullscreen();
  }

  useEffect(() => {
    setIsMobile(/Mobi|Android|iPhone|iPad|iPod|Touch/i.test(navigator.userAgent));

    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x87ceeb, 20, 120); // light sky fog
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(0, 2, 10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x87ceeb, 1); // sky blue
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x404040, 1.2);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(10, 20, 10);
    scene.add(dir);

    // Parallax background layers (big quads behind world)
    const bgs: THREE.Mesh[] = [];
    const bgGeo = new THREE.PlaneGeometry(500, 200);
    const colors = [0xb3e5fc, 0x90caf9, 0x64b5f6];
    colors.forEach((c, i) => {
      const m = new THREE.MeshBasicMaterial({ color: c });
      const p = new THREE.Mesh(bgGeo, m);
      p.position.set(0, 0, -50 - i * 10);
      scene.add(p);
      bgs.push(p);
    });

    // Ground & platforms materials
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 1 });
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x66bb6a, roughness: 1 });
    const blockMat = new THREE.MeshStandardMaterial({ color: 0xcc8f00, metalness: 0.1, roughness: 0.8 });

    // Helper to create a ground segment with a grass cap
    function makeGround(x: number, width: number): THREE.Mesh[] {
      const base = new THREE.Mesh(new THREE.BoxGeometry(width, 2, 10), groundMat);
      base.position.set(x + width / 2, -2, 0);
      const grass = new THREE.Mesh(new THREE.BoxGeometry(width, 0.4, 10.2), grassMat);
      grass.position.set(x + width / 2, -1, 0);
      scene.add(base, grass);
      return [base, grass];
    }

    // Build a long level with segments
    const world = worldObjectsRef.current;
    const segments = [
      { x: -20, w: 40 },
      { x: 25, w: 35 },
      { x: 70, w: 40 },
      { x: 120, w: 60 },
    ];
    segments.forEach(s => {
      const [g1, g2] = makeGround(s.x, s.w);
      world.ground.push(g1, g2);
    });

    // Floating platforms
    const platforms: THREE.Mesh[] = [];
    const addPlatform = (x: number, y: number, w = 6) => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(w, 0.8, 10), blockMat);
      p.position.set(x, y, 0);
      p.castShadow = true;
      p.receiveShadow = true;
      scene.add(p);
      platforms.push(p);
    };
    [
      { x: 10, y: 2 },
      { x: 18, y: 3.5 },
      { x: 38, y: 4 },
      { x: 50, y: 6 },
      { x: 58, y: 3 },
      { x: 86, y: 5 },
      { x: 96, y: 3.5 },
      { x: 108, y: 6 },
    ].forEach(p => addPlatform(p.x, p.y));
    world.platforms = platforms;

    // Coins
    const coinMat = new THREE.MeshStandardMaterial({ color: 0xffd54f, emissive: 0x553300, emissiveIntensity: 0.3 });
    const coins: THREE.Mesh[] = [];
    function addCoin(x: number, y: number) {
      const geo = new THREE.TorusGeometry(0.35, 0.12, 8, 16);
      const m = new THREE.Mesh(geo, coinMat);
      m.position.set(x, y, 0);
      m.userData = { type: "coin" };
      scene.add(m);
      coins.push(m);
    }
    [
      [6, 1.2], [10, 3.2], [18, 4.7], [38, 6], [50, 7.5], [58, 4.2], [72, 0.6], [80, 1.2], [86, 6.8], [96, 5.0], [108, 7.8], [128, 1.2], [142, 1.2]
    ].forEach(([x, y]) => addCoin(x as number, y as number));
    world.coins = coins;

    // Flag (win)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 10, 12), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    pole.position.set(172, 3, 0);
    const flag = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 0.1), new THREE.MeshStandardMaterial({ color: 0x00c853 }));
    flag.position.set(173, 6.5, 0);
    scene.add(pole, flag);
    world.flag = flag;

    // Enemies (simple walkers)
    const enemies: { mesh: THREE.Mesh; dir: number; left: number; right: number }[] = [];
    function addEnemy(x: number, left: number, right: number) {
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), new THREE.MeshStandardMaterial({ color: 0x6d4c41 }));
      body.position.set(x, -0.8, 0);
      body.userData = { type: "enemy" };
      scene.add(body);
      enemies.push({ mesh: body, dir: 1, left, right });
    }
    addEnemy(30, 25, 40);
    addEnemy(76, 70, 90);
    addEnemy(136, 130, 150);
    world.enemies = enemies;

    // Player (hero) — a capsule-like body using two meshes parented to a Group
    const hero = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.7), new THREE.MeshStandardMaterial({ color: 0xe53935 }));
    body.position.y = 0;
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.7), new THREE.MeshStandardMaterial({ color: 0xffcc80 }));
    head.position.y = 0.9;
    hero.add(body, head);
    hero.position.set(-16, 0.2, 0);
    hero.userData = { vel: new THREE.Vector3(), onGround: false, width: 0.6, height: 1.6 };
    scene.add(hero);
    playerRef.current = hero as unknown as THREE.Mesh; // we interact with group

    // Keyboard controls
    const down = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = true; };
    const up = (e: KeyboardEvent) => { keysRef.current[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    // Resize
    const onResize = () => {
      const w = window.innerWidth; const h = window.innerHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Hint
    setUi(u => ({ ...u, hint: "Tap/click to go fullscreen. Collect all coins and reach the flag!" }));

    // Animation clock
    const clock = new THREE.Clock();
    clockRef.current = clock;

    // Axis-aligned bounding box helper
    function aabb(mesh: THREE.Object3D) {
      const b = new THREE.Box3().setFromObject(mesh);
      return b;
    }

    // Physics & game loop
    const GRAVITY = -28; // units/s^2 (scaled by dt)
    const JUMP = 10.5;
    const SPEED = 6.5;

    let gameWon = false;

    function step() {
      if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;
      const dt = Math.min(clock.getDelta(), 0.033);

      // Pause
      if (paused) {
        renderer.render(scene, camera);
        requestAnimationFrame(step);
        return;
      }

      // Parallax: slight offset based on camera x
      world.bgLayers.forEach?.(() => {}); // kept for conceptual clarity
      bgs.forEach((layer, i) => {
        const factor = 0.1 + i * 0.05;
        layer.position.x = camera.position.x * factor;
      });

      // Move enemies
      world.enemies.forEach(e => {
        e.mesh.position.x += e.dir * 1.7 * dt;
        if (e.mesh.position.x < e.left) e.dir = 1;
        if (e.mesh.position.x > e.right) e.dir = -1;
      });

      // Player movement
      const hero = playerRef.current!;
      const vel = (hero.userData.vel as THREE.Vector3);
      const onGroundPrev = !!hero.userData.onGround;
      let move = 0;
      if (keysRef.current["arrowright"] || keysRef.current["d"]) move += 1;
      if (keysRef.current["arrowleft"] || keysRef.current["a"]) move -= 1;
      vel.x = move * SPEED;

      // jump
      if ((keysRef.current["arrowup"] || keysRef.current["w"] || keysRef.current[" "] || keysRef.current["space"]) && hero.userData.onGround) {
        vel.y = JUMP;
        hero.userData.onGround = false;
        playBeep(880, 0.1, "square", 0.05);
      }

      // gravity
      vel.y += GRAVITY * dt;

      // Integrate
      hero.position.x += vel.x * dt;
      hero.position.y += vel.y * dt;

      // Collisions with ground and platforms
      const heroBox = aabb(hero);
      const solids = [...world.ground, ...world.platforms];
      let landed = false;
      for (const s of solids) {
        const sb = aabb(s);
        if (heroBox.intersectsBox(sb)) {
          // Determine side — check previous y to resolve vertical first
          const heroBottom = heroBox.min.y;
          const solidTop = sb.max.y;
          const heroTop = heroBox.max.y;
          const solidBottom = sb.min.y;
          const heroLeft = heroBox.min.x;
          const heroRight = heroBox.max.x;
          const solidLeft = sb.min.x;
          const solidRight = sb.max.x;

          const overlapX = Math.min(heroRight - solidLeft, solidRight - heroLeft);
          const overlapY = Math.min(heroTop - solidBottom, solidTop - heroBottom);

          if (overlapY < overlapX) {
            // Resolve vertical
            if (hero.position.y > s.position.y) {
              // land on top
              hero.position.y += overlapY + 0.001;
              vel.y = 0;
              landed = true;
            } else {
              // hit ceiling
              hero.position.y -= overlapY + 0.001;
              vel.y = Math.min(vel.y, 0);
            }
          } else {
            // Resolve horizontal
            if (hero.position.x < s.position.x) {
              hero.position.x -= overlapX + 0.001;
            } else {
              hero.position.x += overlapX + 0.001;
            }
            vel.x = 0;
          }
        }
      }
      hero.userData.onGround = landed;

      // Collect coins
      world.coins.forEach((c, i) => {
        if (!c.visible) return;
        c.rotation.y += dt * 3;
        const cb = aabb(c);
        if (heroBox.intersectsBox(cb)) {
          c.visible = false;
          setUi(u => ({ ...u, coins: u.coins + 1 }));
          playBeep(1200, 0.1, "square", 0.06);
        }
      });

      // Enemy collisions (stomp or hurt)
      for (const e of world.enemies) {
        if (!e.mesh.visible) continue;
        const eb = aabb(e.mesh);
        if (heroBox.intersectsBox(eb)) {
          // if falling down -> stomp
          if (vel.y < -1) {
            e.mesh.visible = false;
            vel.y = JUMP * 0.7; // bounce
            playBeep(600, 0.12, "triangle", 0.07);
          } else {
            // hurt: reset position
            playBeep(220, 0.25, "sawtooth", 0.06);
            hero.position.set(-16, 0.2, 0);
            vel.set(0, 0, 0);
            setUi(u => ({ ...u, status: "Ouch! Try again." }));
            break;
          }
        }
      }

      // Win condition – reach flag
      if (!gameWon && world.flag) {
        const fb = aabb(world.flag);
        if (heroBox.intersectsBox(fb)) {
          gameWon = true;
          setUi(u => ({ ...u, status: "You win! 🎉" }));
          playBeep(880, 0.15, "square", 0.06);
          playBeep(1175, 0.15, "square", 0.06);
          playBeep(1567, 0.2, "square", 0.06);
        }
      }

      // Camera follow (smooth)
      const targetX = THREE.MathUtils.clamp(hero.position.x, -18, 180);
      camera.position.x += (targetX - camera.position.x) * 0.1;
      camera.position.y += ((hero.position.y + 2) - camera.position.y) * 0.05;

      renderer.render(scene, camera);
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);

    // Cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      if (renderer) {
        renderer.dispose();
        mountRef.current?.removeChild(renderer.domElement);
      }
      audioCtxRef.current?.close().catch(() => {});
    };
  }, [paused]);

  // Mobile control helpers — synthesize key events
  const sendKey = (key: string, down: boolean) => () => {
    keysRef.current[key] = down;
  };

  // Fullscreen toggle on canvas click/tap
  const handleCanvasPointer = () => {
    const isFs = !!document.fullscreenElement;
    if (!isFs && mountRef.current) enterFullscreen(mountRef.current);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <div
        ref={mountRef}
        onPointerDown={handleCanvasPointer}
        className="absolute inset-0 cursor-pointer"
      />

      {/* Top HUD */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 p-3 flex items-center justify-between text-white text-sm">
        <div className="bg-black/40 rounded-2xl px-3 py-1">Coins: {ui.coins}</div>
        <div className="bg-black/40 rounded-2xl px-3 py-1">{ui.status || ui.hint}</div>
      </div>

      {/* Controls & actions */}
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          className="rounded-2xl px-3 py-2 bg-white/80 hover:bg-white text-black shadow"
          onClick={() => setPaused(p => !p)}
        >{paused ? "Resume" : "Pause"}</button>
        <button
          className="rounded-2xl px-3 py-2 bg-white/80 hover:bg-white text-black shadow"
          onClick={() => (document.fullscreenElement ? exitFullscreen() : mountRef.current && enterFullscreen(mountRef.current))}
        >Fullscreen</button>
      </div>

      {/* Mobile controls */}
      {isMobile && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 select-none">
          <div className="flex gap-3">
            <button
              className="w-16 h-16 rounded-full bg-white/70 active:bg-white text-black text-2xl shadow"
              onTouchStart={sendKey("arrowleft", true)}
              onTouchEnd={sendKey("arrowleft", false)}
            >◀</button>
            <button
              className="w-16 h-16 rounded-full bg-white/70 active:bg-white text-black text-2xl shadow"
              onTouchStart={sendKey("arrowright", true)}
              onTouchEnd={sendKey("arrowright", false)}
            >▶</button>
          </div>
          <button
            className="w-16 h-16 rounded-full bg-white/70 active:bg-white text-black text-2xl shadow"
            onTouchStart={sendKey(" ", true)}
            onTouchEnd={sendKey(" ", false)}
          >⤒</button>
        </div>
      )}

      {/* Desktop help */}
      {!isMobile && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/40 px-3 py-1 rounded-full">
          WASD / Arrow keys to move, Spacessss to jump. Click canvas for fullscreen.
        </div>
      )}
    </div>
  );
}
