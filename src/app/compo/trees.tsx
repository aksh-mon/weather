'use client';
import Image from 'next/image';
import TreeImage from '../../../public/tree.svg'; // Replace with your actual image path

export default function TreeWithRain() {
  return (
    <div className="relative w-full h-[400px] overflow-hidden bg-black flex items-center justify-center">
      {/* Your tree image */}
      <Image
        src={TreeImage}
        alt="Tree"
        className="w-auto h-full object-contain z-10"
      />

      {/* Rain overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 w-[1px] h-8 bg-white opacity-50 animate-raindrop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random()}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Add custom CSS animation */}
      <style jsx>{`
        @keyframes raindrop {
          0% {
            transform: translateY(-10%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(110%);
            opacity: 0;
          }
        }
        .animate-raindrop {
          animation-name: raindrop;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      `}</style>
    </div>
  );
}
