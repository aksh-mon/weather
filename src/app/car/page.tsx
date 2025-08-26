/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function RacePage() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile control flags
  const controlsRef = useRef({
    left: false,
    right: false,
    accel: false,
    brake: false,
  });

  useEffect(() => {
    setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101214);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 6.5, 12);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(5, 10, 5);
    scene.add(dir);

    // Road (three lanes)
    const ROAD_WIDTH = 12; // total width
    const LANE_COUNT = 3;
    const LANE_WIDTH = ROAD_WIDTH / LANE_COUNT;
    const roadGeom = new THREE.PlaneGeometry(ROAD_WIDTH, 400, 1, 1);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x2b2f33 });
    const road = new THREE.Mesh(roadGeom, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.z = -150;
    scene.add(road);

    // Lane divider lines (moving to fake speed)
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xf5f7fa });
    const lineGroup = new THREE.Group();
    const SEGMENTS = 24;
    for (let lane = -1; lane <= 1; lane++) {
      if (lane === 0) continue; // center lane gets two lines (either side)
    }
    // Draw dashed center lines for each lane boundary: x = -LANE_WIDTH/2 and x = +LANE_WIDTH/2
    const boundaries = [-LANE_WIDTH / 2, LANE_WIDTH / 2];
    boundaries.forEach((x) => {
      for (let i = 0; i < SEGMENTS; i++) {
        const seg = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 4), lineMat);
        seg.rotation.x = -Math.PI / 2;
        seg.position.set(x, 0.01, -i * 8);
        lineGroup.add(seg);
      }
    });
    scene.add(lineGroup);

    // Guard rails
    const railGeom = new THREE.BoxGeometry(0.3, 0.8, 400);
    const railMat = new THREE.MeshStandardMaterial({ color: 0x555b61 });
    const leftRail = new THREE.Mesh(railGeom, railMat);
    const rightRail = new THREE.Mesh(railGeom, railMat);
    leftRail.position.set(-ROAD_WIDTH / 2 - 0.2, 0.4, -150);
    rightRail.position.set(ROAD_WIDTH / 2 + 0.2, 0.4, -150);
    scene.add(leftRail, rightRail);

    // Player car
    const car = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.6, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x4f9cff })
    );
    body.position.y = 0.6 / 2;
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.5, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x1e90ff, metalness: 0.2, roughness: 0.4 })
    );
    cabin.position.set(0, 0.6, -0.2);
    car.add(body, cabin);

    // Wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x171a1f });
    const wheelGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.4, 16);
    function wheel(x: number, z: number) {
      const w = new THREE.Mesh(wheelGeom, wheelMat);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.25, z);
      return w;
    }
    car.add(
      wheel(0.5, 0.9),
      wheel(-0.5, 0.9),
      wheel(0.5, -0.9),
      wheel(-0.5, -0.9)
    );

    car.position.set(0, 0, 6); // slightly towards camera
    scene.add(car);

    // Enemies (other cars)
    type Enemy = { mesh: THREE.Group; bbox: THREE.Box3 };
    const enemies: Enemy[] = [];

    function createEnemy(laneIndex: number, z: number) {
      const enemy = new THREE.Group();
      const eBody = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.6, 2.2),
        new THREE.MeshStandardMaterial({ color: 0xff4757 })
      );
      eBody.position.y = 0.6 / 2;
      const eCabin = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.5, 1.0),
        new THREE.MeshStandardMaterial({ color: 0xff6b81 })
      );
      eCabin.position.set(0, 0.6, -0.2);
      enemy.add(eBody, eCabin);
      const x = (laneIndex - 1) * LANE_WIDTH; // lane: 0,1,2 -> -LANE, 0, +LANE
      enemy.position.set(x, 0, z);
      scene.add(enemy);
      return { mesh: enemy, bbox: new THREE.Box3().setFromObject(enemy) };
    }

    // Input
    const keys: Record<string, boolean> = {};
    const onKeyDown = (e: KeyboardEvent) => (keys[e.key.toLowerCase()] = true);
    const onKeyUp = (e: KeyboardEvent) => (keys[e.key.toLowerCase()] = false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Resize
    const onResize = () => {
      if (!mount) return;
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // Fullscreen on click/tap
    const goFullscreen = () => {
      if (document.fullscreenElement) return;
      mount.requestFullscreen?.();
    };
    renderer.domElement.addEventListener("pointerdown", goFullscreen);

    // Game state
    let running = true;
    let last = performance.now();
    let speed = 12; // world units per second
    let zOffset = 0; // move world backwards
    let spawnTimer = 0;
    let scoreAcc = 0;

    // Spawn a few initial enemies
    for (let i = 0; i < 5; i++) {
      const lane = Math.floor(Math.random() * 3); // 0..2
      enemies.push(createEnemy(lane, -20 - i * 30));
    }

    // Helpers
    const clamp = (v: number, min: number, max: number) =>
      Math.max(min, Math.min(max, v));

    const carBBox = new THREE.Box3();

    function resetGame() {
      // remove enemies
      enemies.forEach((e) => scene.remove(e.mesh));
      enemies.length = 0;
      // reset values
      speed = 12;
      zOffset = 0;
      spawnTimer = 0;
      scoreAcc = 0;
      car.position.x = 0;
      car.position.z = 6;
      setScore(0);
      setGameOver(false);
      running = true;
      // spawn again
      for (let i = 0; i < 5; i++) {
        const lane = Math.floor(Math.random() * 3);
        enemies.push(createEnemy(lane, -20 - i * 30));
      }
    }

    // Animation loop
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.04, (now - last) / 1000); // clamp step
      last = now;
      if (running) {
        // Controls
        const steerLeft =
          keys["arrowleft"] || keys["a"] || controlsRef.current.left;
        const steerRight =
          keys["arrowright"] || keys["d"] || controlsRef.current.right;
        const accel =
          keys["arrowup"] || keys["w"] || controlsRef.current.accel;
        const brake = keys["arrowdown"] || keys["s"] || controlsRef.current.brake;

        const steer = (steerRight ? 1 : 0) - (steerLeft ? 1 : 0);
        const accelVal = (accel ? 1 : 0) - (brake ? 1 : 0);

        // Speed changes
        speed += accelVal * 20 * dt; // accelerate/brake
        speed = clamp(speed, 6, 35);

        // Move "world" backwards: simulate forward motion
        zOffset += speed * dt;

        // Scroll lane dash segments
        lineGroup.children.forEach((seg) => {
          seg.position.z += speed * dt;
          if (seg.position.z > 8) seg.position.z -= SEGMENTS * 8;
        });

        // Sway camera slightly with speed
        camera.position.x = THREE.MathUtils.damp(
          camera.position.x,
          car.position.x * 0.25,
          5,
          dt
        );

        // Car steering within road bounds
        const maxX = (ROAD_WIDTH / 2) - 0.9;
        car.position.x = clamp(car.position.x + steer * 8 * dt, -maxX, maxX);

        // Enemy movement (towards player)
        for (let i = enemies.length - 1; i >= 0; i--) {
          const e = enemies[i];
          e.mesh.position.z += speed * dt * 0.95; // slightly slower than world
          e.bbox.setFromObject(e.mesh);

          // Remove if passed behind camera
          if (e.mesh.position.z > 14) {
            scene.remove(e.mesh);
            enemies.splice(i, 1);
          }
        }

        // Spawn new enemies
        spawnTimer -= dt;
        if (spawnTimer <= 0) {
          const lane = Math.floor(Math.random() * 3);
          const gap = 28 + Math.random() * 10;
          enemies.push(createEnemy(lane, -120 - Math.random() * 40));
          spawnTimer = gap / speed; // more speed -> more frequent
        }

        // Collision
        carBBox.setFromObject(car);
        for (const e of enemies) {
          if (carBBox.intersectsBox(e.bbox)) {
            running = false;
            setGameOver(true);
            break;
          }
        }

        // Score (distance)
        scoreAcc += speed * dt;
        if (scoreAcc >= 1) {
          setScore((s) => s + Math.floor(scoreAcc));
          scoreAcc %= 1;
        }

        // Tiny car tilt on steer
        car.rotation.z = THREE.MathUtils.damp(car.rotation.z, -steer * 0.15, 7, dt);
      }

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    };
    tick();

    // Cleanup
    return () => {
      running = false;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      renderer.domElement.removeEventListener("pointerdown", goFullscreen);
      mount.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        if ((obj as any).geometry) (obj as any).geometry.dispose?.();
        if ((obj as any).material) {
          const m = (obj as any).material;
          if (Array.isArray(m)) m.forEach((mm) => mm.dispose?.());
          else m.dispose?.();
        }
      });
    };
  }, []);

  // Helpers for mobile control buttons
  const press = (key: keyof typeof controlsRef.current, v: boolean) => {
    controlsRef.current[key] = v;
  };

  const restart = () => {
    // Trigger a remount for simplicity
    setGameOver(false);
    setScore(0);
    // force rerender of canvas by flipping a key on container
    const el = mountRef.current;
    if (!el) return;
    // remove and re-add a tiny node to retrigger effect cleanup is already handled inside reset path
    // simpler approach: soft reload page route
    window.location.reload();
  };

  return (
    <div className="relative w-full h-screen bg-black text-white select-none overflow-hidden">
      {/* Canvas mount */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* HUD */}
      <div className="absolute top-3 left-4 text-sm sm:text-base bg-white/10 backdrop-blur px-3 py-2 rounded-xl">
        <div className="font-semibold tracking-wide">Score: {score}</div>
        <div className="opacity-80 text-xs mt-1 hidden sm:block">
          Controls: ← → to steer, ↑ to accelerate, ↓ to brake.  
          Click/tap once to go fullscreen.
        </div>
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/70 backdrop-blur px-6 py-5 rounded-2xl text-center">
            <div className="text-2xl font-bold mb-2">Crash!</div>
            <div className="mb-4">Final Score: {score}</div>
            <button
              onClick={restart}
              className="px-4 py-2 rounded-xl bg-white text-black font-semibold"
            >
              Restart
            </button>
          </div>
        </div>
      )}

      {/* Mobile Controls (show on small screens) */}
      {isMobile && (
        <div className="absolute bottom-4 left-0 right-0 px-4 flex items-end justify-between gap-6">
          {/* Steering */}
          <div className="flex gap-3">
            <button
              className="w-16 h-16 rounded-full bg-white/15 backdrop-blur active:scale-95"
              onPointerDown={() => press("left", true)}
              onPointerUp={() => press("left", false)}
              onPointerCancel={() => press("left", false)}
              onPointerLeave={() => press("left", false)}
            >
              ←
            </button>
            <button
              className="w-16 h-16 rounded-full bg-white/15 backdrop-blur active:scale-95"
              onPointerDown={() => press("right", true)}
              onPointerUp={() => press("right", false)}
              onPointerCancel={() => press("right", false)}
              onPointerLeave={() => press("right", false)}
            >
              →
            </button>
          </div>

          {/* Speed */}
          <div className="flex gap-3">
            <button
              className="w-16 h-16 rounded-full bg-white/15 backdrop-blur active:scale-95"
              onPointerDown={() => press("brake", true)}
              onPointerUp={() => press("brake", false)}
              onPointerCancel={() => press("brake", false)}
              onPointerLeave={() => press("brake", false)}
            >
              🅱️
            </button>
            <button
              className="w-16 h-16 rounded-full bg-white/15 backdrop-blur active:scale-95"
              onPointerDown={() => press("accel", true)}
              onPointerUp={() => press("accel", false)}
              onPointerCancel={() => press("accel", false)}
              onPointerLeave={() => press("accel", false)}
            >
              ⚡
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
