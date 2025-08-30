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
    scene.background = new THREE.Color("#87CEEB"); // light blue sky

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // --- Central Rotating Triangle ---
    const triangleGeo = new THREE.CircleGeometry(2, 3); // equilateral triangle
    const triangleMat = new THREE.MeshStandardMaterial({
      color: "#C0A060", // warm sandy color instead of dark
      flatShading: true,
    });
    const triangle = new THREE.Mesh(triangleGeo, triangleMat);
    scene.add(triangle);

    // --- Layered Mountains (Sand colors) ---
    function createMountainLayer(color: string, y: number, z: number, scale: number) {
      const shape = new THREE.Shape();
      shape.moveTo(-10, 0);
      for (let i = -10; i <= 10; i += 1) {
        shape.lineTo(i, Math.random() * 1.5); // jagged
      }
      shape.lineTo(10, -5);
      shape.lineTo(-10, -5);
      const geo = new THREE.ShapeGeometry(shape);
      const mat = new THREE.MeshBasicMaterial({ color, depthWrite: false });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, y, z);
      mesh.scale.set(scale, scale, 1);
      return mesh;
    }

    const mountains: THREE.Mesh[] = [];
    const mountainColors = ["#C2B280", "#D2B48C", "#E0C097", "#F4E1C1"]; // sand tones
    for (let i = 0; i < 4; i++) {
      const layer = createMountainLayer(
        mountainColors[i],
        -3 + i * 0.5,
        -i * 0.5,
        1 + i * 0.2
      );
      scene.add(layer);
      mountains.push(layer);
    }

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6); // brighter daylight
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xfff5c0, 1); // warm sunlight
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // Clock
    const clock = new THREE.Clock();

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotate triangle
      triangle.rotation.z = t * 0.4;

      // Pulse triangle color (warm sandy tones)
      const pulse = (Math.sin(t * 2) + 1) / 2; // 0 → 1
      (triangle.material as THREE.MeshStandardMaterial).color.set(
        new THREE.Color().lerpColors(
          new THREE.Color("#D2B48C"), // tan
          new THREE.Color("#FFD580"), // sandy yellow
          pulse
        )
      );

      // Subtle mountain drifting
      mountains.forEach((m, i) => {
        m.position.x = Math.sin(t * 0.1 + i) * 0.2;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-screen" ref={mountRef}>
      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 font-serif drop-shadow-lg">
        <h1 className="text-6xl font-extrabold mb-6 dev text-center">
          नवीनं नूतनं मोचनं अन्वेष्यताम् .
        </h1>
        <button className="btn-wind px-8 py-3 rounded-full text-4xl font-bold bg-yellow-500 hover:bg-yellow-600 text-black transition">
          ?
        </button>
      </div>
    </div>
  );
}
