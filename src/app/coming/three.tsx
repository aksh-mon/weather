/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PyramidHome() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#C2B280"); // start with sand

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Pyramid Geometry: square base
    const pyramidGeo = new THREE.ConeGeometry(1, 2, 4); // square-based pyramid
    const pyramidMat = new THREE.MeshStandardMaterial({
      color: "#fbbf24", // summer yellow
      flatShading: true,
    });

    const pyramids: THREE.Mesh[] = [];
    for (let i = 0; i < 12; i++) {
      const mesh = new THREE.Mesh(pyramidGeo, pyramidMat.clone());
      mesh.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 14
      );
      scene.add(mesh);
      pyramids.push(mesh);
    }

    // Dust Particles
    const particleCount = 400;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 30;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      color: "#ffffff",
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    // Season Colors
    const seasons = [
      { bg: "#C2B280", color: "#facc15" }, // Summer (sand, yellow)
      { bg: "#92400e", color: "#ea580c" }, // Autumn (brown, orange)
      { bg: "#1e3a8a", color: "#93c5fd" }, // Winter (blue, icy white)
      { bg: "#065f46", color: "#10b981" }, // Spring (green, teal)
    ];
    let seasonIndex = 0;
    let nextSeasonIndex = 1;
    let seasonProgress = 0;

    // Clock
    const clock = new THREE.Clock();

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();

      // Rotate pyramids
      pyramids.forEach((p) => {
        p.rotation.y += 0.01;
        p.rotation.x += 0.005;
      });

      // Particles drift
      particles.rotation.y += 0.0005;

      // Season blending
      seasonProgress += delta * 0.05; // slower transition
      if (seasonProgress >= 1) {
        seasonProgress = 0;
        seasonIndex = nextSeasonIndex;
        nextSeasonIndex = (nextSeasonIndex + 1) % seasons.length;
      }

      const current = seasons[seasonIndex];
      const next = seasons[nextSeasonIndex];

      // Interpolate colors
      const bgColor = new THREE.Color(current.bg).lerp(
        new THREE.Color(next.bg),
        seasonProgress
      );
      const pyrColor = new THREE.Color(current.color).lerp(
        new THREE.Color(next.color),
        seasonProgress
      );

      scene.background = bgColor;
      pyramids.forEach((p) => {
        (p.material as THREE.MeshStandardMaterial).color = pyrColor;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-screen" ref={mountRef}>
      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 font-serif">
        <h1 className="text-6xl font-extrabold mb-6 dev" >
          नवीनं नूतनं मोचनं अन्वेष्यताम् .
        </h1>
        <button className="btn-wind px-8 py-3 rounded-full text-4xl font-bold">
          ?
        </button>

        <style jsx>{`
    .btn-wind {
      background: transparent;
      color: #ddd;
      box-shadow: 0 0 20px rgba(255, 255, 200, 0.9),
        0 0 40px rgba(200, 180, 100, 0.6),
        0 0 80px rgba(150, 120, 50, 0.4);
      transition: all 0.6s ease-in-out;
      position: relative;
      overflow: hidden;
    }

    .btn-wind:hover {
      filter: grayscale(0%);
      background: black;
      color: white;
      box-shadow: 0 0 25px rgba(255, 255, 255, 0.8),
        0 0 50px rgba(200, 200, 255, 0.6),
        0 0 100px rgba(150, 150, 255, 0.4);
    }

    .btn-wind::after {
      content: "";
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.6), transparent);
      animation: pulse 3s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.8);
        opacity: 0.7;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.2;
      }
      100% {
        transform: scale(0.8);
        opacity: 0.7;
      }
    }

    .animate-spin-slow {
      display: inline-block;
      animation: spin 12s linear infinite;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
        0 0 20px rgba(255, 200, 150, 0.7);
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `}</style>
      </div>


    </div>
  );
}
