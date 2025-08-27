/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Full-featured Mario-style platformer with:
 * - Loader + Start modal (name + avatar: male/female + skin tones)
 * - Pause/resume (freezes physics exactly)
 * - Game HUD (score, coins, pause)
 * - Custom modal alerts (centered) with animated border and dark/light switch
 * - Improved jump physics and simple human-like avatar (hair + ears)
 *
 * Drop this file into a Next.js `app` route (e.g. app/game/page.tsx). Uses Tailwind utility classes
 * for quick styling — adjust as you need.
 */

type Avatar = {
  gender: "male" | "female";
  skin: string; // hex color
};

export default function Platformer3DFull() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const playerRef = useRef<THREE.Group | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const worldRef = useRef<any>({ ground: [], platforms: [], coins: [], enemies: [], flag: null, bgLayers: [] });
  const keysRef = useRef<Record<string, boolean>>({});

  // UI state
  const [isMobile, setIsMobile] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showStartModal, setShowStartModal] = useState(true);
  const [playerName, setPlayerName] = useState("");
  const [avatar, setAvatar] = useState<Avatar>({ gender: "male", skin: "#ffdbac" });
  const [coins, setCoins] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const [dark, setDark] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Audio (lazy)
  const audioCtxRef = useRef<AudioContext | null>(null);
  function createAudio() {
    if (audioCtxRef.current) return;
    try {
      const Ctor: any = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) return;
      audioCtxRef.current = new Ctor();
    } catch (err) {
      console.warn("Audio blocked or unavailable", err);
      audioCtxRef.current = null;
    }
  }
  function beep(freq: number, dur = 0.08) {
    try {
      createAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = freq;
      g.gain.value = 0.05;
      o.connect(g); g.connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + dur);
    } catch (e) { console.warn(e); }
  }

  // Fullscreen helpers (guarded)
  async function tryFullscreen(el: HTMLElement | null) {
    if (!el) return;
    if (!document.fullscreenEnabled && !(document as any).webkitFullscreenEnabled) {
      setAlertMsg("Fullscreen not allowed here. Using viewport fit instead.");
      return;
    }
    try { await (el.requestFullscreen?.() || (el as any).webkitRequestFullscreen?.()); } catch (err) { console.warn(err); setAlertMsg("Unable to enter fullscreen (blocked)."); }
  }

  useEffect(() => {
    setIsMobile(/Mobi|Android|iPhone|iPad|iPod|Touch/i.test(navigator.userAgent));

    // fake loader to show progress (simulate asset loading)
    let t = 0;
    setLoadingProgress(0);
    const int = setInterval(() => {
      t += Math.random() * 12 + 6; // random progress
      setLoadingProgress(Math.min(100, Math.round(t)));
      if (t >= 100) clearInterval(int);
    }, 120);

    // Build Three.js scene after small timeout so loader animates
    const startBuild = setTimeout(() => buildScene(), 700);

    return () => { clearInterval(int); clearTimeout(startBuild); cleanupScene(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function cleanupScene() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const renderer = rendererRef.current;
    try { renderer?.forceContextLoss?.(); } catch {}
    renderer?.dispose();
    try { if (mountRef.current && renderer?.domElement) mountRef.current.removeChild(renderer.domElement); } catch {}
    audioCtxRef.current?.close().catch(() => {});
  }

  function buildScene() {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x87ceeb, 20, 180);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2.5, 10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x87ceeb);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // lights
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
    const dl = new THREE.DirectionalLight(0xffffff, 0.9); dl.position.set(5, 10, 5); scene.add(dl);

    // parallax background
    const bgs: THREE.Mesh[] = [];
    const bgGeo = new THREE.PlaneGeometry(800, 300);
    [0xb3e5fc, 0x90caf9, 0x64b5f6].forEach((c, i) => {
      const m = new THREE.MeshBasicMaterial({ color: c });
      const p = new THREE.Mesh(bgGeo, m); p.position.set(0, 0, -60 - i * 10); scene.add(p); bgs.push(p);
    });
    worldRef.current.bgLayers = bgs;

    // ground
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
    function makeGround(x: number, w: number) {
      const base = new THREE.Mesh(new THREE.BoxGeometry(w, 2, 12), groundMat);
      base.position.set(x + w / 2, -2, 0); scene.add(base); worldRef.current.ground.push(base);
      return base;
    }
    [[-30, 60], [40, 50], [110, 80]].forEach(s => makeGround(s[0], s[1]));

    // platforms
    const blockMat = new THREE.MeshStandardMaterial({ color: 0xcc8f00 });
    function addPlatform(x: number, y: number, w = 6) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(w, 0.8, 10), blockMat);
      p.position.set(x, y, 0); scene.add(p); worldRef.current.platforms.push(p);
    }
    [[10, 2], [26, 3.2], [38, 4.6], [62, 3.5], [88, 5.8], [128, 6]].forEach(a => addPlatform(a[0], a[1]));

    // coins
    const coinMat = new THREE.MeshStandardMaterial({ color: 0xffd54f, emissive: 0x553300 });
    function addCoin(x: number, y: number) {
      const c = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.12, 8, 16), coinMat);
      c.position.set(x, y, 0); scene.add(c); worldRef.current.coins.push(c);
    }
    [[12, 3.4],[26,4.4],[38,6.0],[62,4.0],[88,7.0],[128,7.5]].forEach(a => addCoin(a[0], a[1]));

    // flag
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 10), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    pole.position.set(200, 3, 0); scene.add(pole);
    const flag = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 0.1), new THREE.MeshStandardMaterial({ color: 0x00c853 }));
    flag.position.set(201.2, 6.4, 0); scene.add(flag); worldRef.current.flag = flag;

    // enemies
    function addEnemy(x: number, l: number, r: number) {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 12), new THREE.MeshStandardMaterial({ color: 0x6d4c41 }));
      e.position.set(x, -0.8, 0); scene.add(e); worldRef.current.enemies.push({ mesh: e, left: l, right: r, dir: 1 });
    }
    addEnemy(48, 40, 60); addEnemy(96, 92, 110); addEnemy(152, 140, 170);

    // player avatar (group)
    const hero = new THREE.Group();
    function createAvatarMesh(gender: Avatar["gender"], skinHex: string) {
      hero.clear?.();
      // torso
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.7), new THREE.MeshStandardMaterial({ color: gender === "male" ? 0x1565c0 : 0xdb2d6e }));
      torso.position.y = 0.0;
      // head
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: skinHex }));
      head.position.y = 1.05;
      // ears
      const earL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.06), new THREE.MeshStandardMaterial({ color: skinHex })); earL.position.set(-0.46, 1.02, 0);
      const earR = earL.clone(); earR.position.x = 0.46;
      // hair
      let hair: THREE.Mesh;
      if (gender === "male") {
        hair = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.25, 0.75), new THREE.MeshStandardMaterial({ color: 0x2e1511 }));
        hair.position.y = 1.36;
      } else {
        hair = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.36, 0.78), new THREE.MeshStandardMaterial({ color: 0x3e1b12 }));
        hair.position.y = 1.36;
      }
      hero.add(torso, head, earL, earR, hair);
      hero.position.set(-24, 0.6, 0);
      (hero as any).userData = { vel: new THREE.Vector3(0, 0, 0), onGround: false };
    }
    createAvatarMesh(avatar.gender, avatar.skin);
    scene.add(hero); playerRef.current = hero;

    // input
    function down(e: KeyboardEvent) { keysRef.current[e.key.toLowerCase()] = true; }
    function up(e: KeyboardEvent) { keysRef.current[e.key.toLowerCase()] = false; }
    window.addEventListener("keydown", down); window.addEventListener("keyup", up);

    function resize() { const w = window.innerWidth, h = window.innerHeight; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); }
    window.addEventListener("resize", resize);

    // step loop using timestamp to freeze exactly on pause
    let gameWon = false;
    lastTimeRef.current = null;

    function step(ts: number) {
      rafRef.current = requestAnimationFrame(step);
      const renderer = rendererRef.current; const camera = cameraRef.current; const scene = sceneRef.current; if (!renderer || !camera || !scene) return;

      if (lastTimeRef.current === null) lastTimeRef.current = ts;
      const dt = pausedRef.current ? 0 : Math.min((ts - (lastTimeRef.current || ts)) / 1000, 0.05);
      // update lastTime even when paused so resume doesn't jump
      lastTimeRef.current = ts;

      // render parallax regardless so visuals freeze but still draw
      worldRef.current.bgLayers.forEach((layer: THREE.Mesh, i: number) => { const factor = 0.08 + i * 0.04; layer.position.x = (camera.position.x || 0) * factor; });

      if (!pausedRef.current) {
        // enemies
        worldRef.current.enemies.forEach((en: any) => { en.mesh.position.x += en.dir * 1.6 * dt; if (en.mesh.position.x < en.left) en.dir = 1; if (en.mesh.position.x > en.right) en.dir = -1; });

        // player physics
        const heroG = playerRef.current!;
        const ud = (heroG as any).userData;
        const vel = ud.vel as THREE.Vector3;
        const SPEED = 6.5; const GRAV = -24; const JUMP = 9.5;

        let move = 0; if (keysRef.current["arrowright"] || keysRef.current["d"]) move += 1; if (keysRef.current["arrowleft"] || keysRef.current["a"]) move -= 1;
        vel.x = move * SPEED;
        // jump keys (space or up)
        if ((keysRef.current[" "] || keysRef.current["space"] || keysRef.current["arrowup"] || keysRef.current["w"]) && ud.onGround) {
          vel.y = JUMP; ud.onGround = false; beep(880);
        }
        // gravity
        vel.y += GRAV * dt;
        heroG.position.x += vel.x * dt; heroG.position.y += vel.y * dt;

        // collisions with ground/platforms
        const heroBox = new THREE.Box3().setFromObject(heroG);
        let landed = false;
        const solids = [...worldRef.current.ground, ...worldRef.current.platforms];
        for (const s of solids) {
          const sb = new THREE.Box3().setFromObject(s);
          if (heroBox.intersectsBox(sb)) {
            // vertical resolution
            const overlapY = Math.min(heroBox.max.y - sb.min.y, sb.max.y - heroBox.min.y);
            const overlapX = Math.min(heroBox.max.x - sb.min.x, sb.max.x - heroBox.min.x);
            if (overlapY < overlapX) {
              if (heroG.position.y > s.position.y) {
                heroG.position.y += (sb.max.y - heroBox.min.y) + 0.001; vel.y = 0; landed = true;
              } else {
                heroG.position.y -= (heroBox.max.y - sb.min.y) + 0.001; vel.y = Math.min(vel.y, 0);
              }
            } else {
              // horizontal push out
              if (heroG.position.x < s.position.x) heroG.position.x -= overlapX + 0.001; else heroG.position.x += overlapX + 0.001; vel.x = 0;
            }
          }
        }
        ud.onGround = landed;

        // collect coins
        worldRef.current.coins.forEach((c: THREE.Mesh) => {
          if (!c.visible) return; c.rotation.y += dt * 3; const cb = new THREE.Box3().setFromObject(c); if (heroBox.intersectsBox(cb)) { c.visible = false; setCoins(c => c + 1); setScore(s => s + 100); beep(1200); }
        });

        // enemy collisions
        for (const e of worldRef.current.enemies) {
          const eb = new THREE.Box3().setFromObject(e.mesh); if (heroBox.intersectsBox(eb)) {
            if ((ud.vel as THREE.Vector3).y < -1) { e.mesh.visible = false; ud.vel.y = JUMP * 0.6; beep(600); setScore(s => s + 250); }
            else { // hurt
              setLives(l => Math.max(0, l - 1)); beep(220); heroG.position.set(-24, 0.6, 0); ud.vel.set(0, 0, 0); setAlertMsg("You were hit! Lost a life."); break; }
          }
        }

        // flag win
        if (!gameWon && worldRef.current.flag) { const fb = new THREE.Box3().setFromObject(worldRef.current.flag); if (new THREE.Box3().setFromObject(heroG).intersectsBox(fb)) { gameWon = true; setAlertMsg(`Nice, ${playerName || "Player"}! You reached the flag!`); setScore(s => s + 1000); } }

        // camera follow
        const cam = cameraRef.current!; const targetX = THREE.MathUtils.clamp(heroG.position.x, -20, 220);
        cam.position.x += (targetX - cam.position.x) * 0.12; cam.position.y += ((heroG.position.y + 2.2) - cam.position.y) * 0.06;
      }

      renderer.render(scene, camera);
    }

    rafRef.current = requestAnimationFrame(step);

    // when start modal is still visible, freeze updates until user starts
    setLoadingProgress(100);
  }

  // Start game after avatar selection
  function startGame() {
    if (!playerName.trim()) { setAlertMsg("Please enter your name"); return; }
    // update avatar appearance
    const heroG = playerRef.current; if (heroG) {
      // rebuild avatar mesh inside existing group
      heroG.clear?.();
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.7), new THREE.MeshStandardMaterial({ color: avatar.gender === "male" ? 0x1565c0 : 0xdb2d6e })); torso.position.y = 0;
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.7), new THREE.MeshStandardMaterial({ color: avatar.skin })); head.position.y = 1.05;
      const earL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.06), new THREE.MeshStandardMaterial({ color: avatar.skin })); earL.position.set(-0.46, 1.02, 0);
      const earR = earL.clone(); earR.position.x = 0.46;
      const hair = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.3, 0.75), new THREE.MeshStandardMaterial({ color: avatar.gender === "male" ? 0x2e1511 : 0x3e1b12 })); hair.position.y = 1.36;
      heroG.add(torso, head, earL, earR, hair);
    }

    setShowStartModal(false);
    setAlertMsg(null);
    // user gesture: enable audio & try fullscreen
    createAudio(); tryFullscreen(mountRef.current);
  }

  // mobile control helpers: synthesize key state
  function touchKey(key: string, down: boolean) { keysRef.current[key] = down; createAudio(); }

  // modal close helper
  function closeAlert() { setAlertMsg(null); }

  return (
    <div className={"relative w-screen h-screen overflow-hidden " + (dark ? "bg-gray-900 text-white" : "bg-sky-200 text-black")}>
      {/* Canvas mount point */}
      <div ref={mountRef} className="absolute inset-0" onPointerDown={() => { createAudio(); tryFullscreen(mountRef.current); }} />

      {/* Top bar HUD */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto bg-black/40 text-white px-3 py-1 rounded-2xl">Score: {score} &nbsp;|&nbsp; Coins: {coins} &nbsp;|&nbsp; Lives: {lives}</div>
        <div className="pointer-events-auto flex gap-2">
          <button className="bg-white/90 text-black px-3 py-1 rounded" onClick={() => { setPaused(p => !p); }}> {paused ? "Resume" : "Pause"}</button>
          <button className="bg-white/90 text-black px-3 py-1 rounded" onClick={() => tryFullscreen(mountRef.current)}>Fullscreen</button>
        </div>
      </div>

      {/* Loader overlay */}
      {loadingProgress < 100 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-40">
          <div className="w-80 p-6 bg-white/95 rounded-lg text-center">
            <div className="text-lg font-semibold mb-3">Loading game...</div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" style={{ width: `${loadingProgress}%`, transition: 'width 120ms linear' }} />
            </div>
            <div className="mt-3 text-sm text-gray-700">{loadingProgress}%</div>
          </div>
        </div>
      )}

      {/* Start modal: choose name and avatar */}
      {showStartModal && loadingProgress >= 100 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="w-96 p-6 rounded-xl bg-white/95 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Enter Game</h3>
              <div className="flex items-center gap-2">
                <label className="text-sm">Dark</label>
                <input type="checkbox" checked={dark} onChange={e => setDark(e.target.checked)} />
              </div>
            </div>
            <div className="mb-3">
              <label className="text-sm">Your name</label>
              <input value={playerName} onChange={e => setPlayerName(e.target.value)} className="w-full mt-1 p-2 border rounded" placeholder="Type your name" />
            </div>
            <div className="mb-3">
              <div className="text-sm mb-2">Choose avatar</div>
              <div className="flex gap-3">
                <button className={"flex-1 p-3 rounded border " + (avatar.gender === 'male' ? 'ring-2 ring-blue-500' : '')} onClick={() => setAvatar(a => ({ ...a, gender: 'male' }))}>Male</button>
                <button className={"flex-1 p-3 rounded border " + (avatar.gender === 'female' ? 'ring-2 ring-pink-500' : '')} onClick={() => setAvatar(a => ({ ...a, gender: 'female' }))}>Female</button>
              </div>
              <div className="text-sm mt-3 mb-1">Skin tone</div>
              <div className="flex gap-2">
                <button onClick={() => setAvatar(a => ({ ...a, skin: '#ffdbac' }))} className="w-10 h-10 rounded-full" style={{ background: '#ffdbac' }} />
                <button onClick={() => setAvatar(a => ({ ...a, skin: '#f1c27d' }))} className="w-10 h-10 rounded-full" style={{ background: '#f1c27d' }} />
                <button onClick={() => setAvatar(a => ({ ...a, skin: '#c68642' }))} className="w-10 h-10 rounded-full" style={{ background: '#c68642' }} />
                <button onClick={() => setAvatar(a => ({ ...a, skin: '#8d5524' }))} className="w-10 h-10 rounded-full" style={{ background: '#8d5524' }} />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 rounded bg-gray-200" onClick={() => { setPlayerName(''); setAvatar({ gender: 'male', skin: '#ffdbac' }); }}>Reset</button>
              <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={startGame}>Start Game</button>
            </div>
          </div>
        </div>
      )}

      {/* Alert modal (centered) with animated border & dark/light switch on top */}
      {alertMsg && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto">
          <div className="relative w-80 p-6 rounded-xl bg-white/95 dark:bg-gray-800 text-center" style={{ border: '4px solid transparent', animation: 'glow 2.8s linear infinite' }}>
            <style>{`@keyframes glow { 0% { border-color: rgba(239,68,68,0.0); } 20% { border-color: rgba(239,68,68,0.9); } 50% { border-color: rgba(59,130,246,0.9); } 80% { border-color: rgba(245,158,11,0.9); } 100% { border-color: rgba(239,68,68,0.0); } }`}</style>
            <div className="absolute top-3 right-3">
              <label className="mr-2 text-sm">Dark</label>
              <input type="checkbox" checked={dark} onChange={e => setDark(e.target.checked)} />
            </div>
            <div className="text-lg font-semibold mb-3">{alertMsg}</div>
            <div className="flex justify-center gap-3">
              <button className="px-4 py-2 rounded bg-gray-200" onClick={closeAlert}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile controls */}
      {isMobile && !showStartModal && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 select-none pointer-events-auto z-40">
          <div className="flex gap-3">
            <button onTouchStart={() => touchKey('arrowleft', true)} onTouchEnd={() => touchKey('arrowleft', false)} className="w-16 h-16 rounded-full bg-white/80">◀</button>
            <button onTouchStart={() => touchKey('arrowright', true)} onTouchEnd={() => touchKey('arrowright', false)} className="w-16 h-16 rounded-full bg-white/80">▶</button>
          </div>
          <button onTouchStart={() => touchKey(' ', true)} onTouchEnd={() => touchKey(' ', false)} className="w-16 h-16 rounded-full bg-white/80">⤒</button>
        </div>
      )}

      {/* Desktop hint */}
      {!isMobile && !showStartModal && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm bg-black/40 text-white px-3 py-1 rounded z-40">WASD / Arrow keys to move, Space to jump. Click canvas to fullscreen.</div>
      )}

    </div>
  );
}
