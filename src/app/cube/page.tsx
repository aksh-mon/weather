"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CubePage() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Create scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    // 🔹 Function to create a texture with text
    function createTextTexture(text: string) {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "bold 40px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      return new THREE.CanvasTexture(canvas);
    }

    // 🔹 Create 6 materials with "Akshay"
    const materials = Array(6)
      .fill(null)
      .map(
        () => new THREE.MeshBasicMaterial({ map: createTextTexture("Akshay") })
      );

    // Cube
    const cube = new THREE.Mesh(new THREE.BoxGeometry(), materials);
    scene.add(cube);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Resize handling
    const handleResize = () => {
      if (mountRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 🔹 Fullscreen on click
  const goFullscreen = () => {
    if (mountRef.current) {
      mountRef.current.requestFullscreen();
    }
  };

  return (
    <div
      ref={mountRef}
      onClick={goFullscreen}
      className="w-full h-screen bg-black cursor-pointer"
    />
  );
}
