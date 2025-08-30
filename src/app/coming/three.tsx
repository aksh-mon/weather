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
    scene.background = new THREE.Color("#111827"); // Tailwind gray-900

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Geometry: Pyramid (tetrahedron)
    const geometry = new THREE.TetrahedronGeometry(1);
    const material = new THREE.MeshStandardMaterial({
      color: "#facc15", // yellow-400
      flatShading: true,
    });

    // Create multiple pyramids
    const pyramids: THREE.Mesh[] = [];
    for (let i = 0; i < 20; i++) {
      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 10
      );
      scene.add(mesh);
      pyramids.push(mesh);
    }

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      pyramids.forEach((p) => {
        p.rotation.x += 0.01;
        p.rotation.y += 0.01;
        p.position.y += Math.sin(Date.now() * 0.001 + p.position.x) * 0.002;
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
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
        <h1 className="text-5xl font-bold mb-6">✨ Pyramidverse</h1>
        <button className="btn-wind px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-500">
          Explore
        </button>
      </div>

      <style jsx>{`
        .btn-wind {
          background: white;
          color: black;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.8),
            0 0 30px rgba(200, 200, 200, 0.6),
            0 0 60px rgba(150, 150, 150, 0.4);
        }
        .btn-wind:hover {
          filter: grayscale(100%);
          background: black;
          color: white;
          transition: all 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
