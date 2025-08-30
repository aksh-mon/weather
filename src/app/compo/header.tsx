
'use client'
import { Menu, X } from 'lucide-react';
import React, { useState } from 'react'
import Sidebar from '../compo/sidebar';


interface HeaderProps {
  setSelectedGame: React.Dispatch<React.SetStateAction<string>>;
  setMode: React.Dispatch<React.SetStateAction<"game" | "error">>;
}

const Header: React.FC<HeaderProps> = ({ setSelectedGame, setMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <header style={{ position: 'absolute', bottom: '0', scrollbarWidth: 'none' }} className="overflow-hidden bg-transparent w-full h-[10vh] border-b-2 border-b-cyan-700 relative z-[9999] flex justify-end items-center px-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="icon-tornado-btn relative flex items-center justify-center w-[3rem] h-[3rem] rounded-b-4xl"
          style={{ rotate: "-35deg" }}
        >
          {isSidebarOpen ? (
            <X className="w-[3rem] h-[3rem] text-gray-200 z-10 " />
          ) : (
            <Menu className="w-[2rem] h-[2rem] text-gray-200 z-10" />
          )}

          <style jsx>{`
    .icon-tornado-btn {
      background: linear-gradient(145deg, #1f2937, #111827); /* dark gradient */
      box-shadow: 0 0 20px rgba(31, 41, 55, 0.8),
        0 0 40px rgba(17, 24, 39, 0.6), 0 0 60px rgba(0, 0, 0, 0.9);
      transition: all 0.6s ease-in-out;
      overflow: hidden;
    }
    .icon-tornado-btn::before {
      content: "";
      position: absolute;
      inset: -40%;
      background: conic-gradient(
        from 0deg,
        rgba(255, 255, 255, 0.1),
        rgba(0, 0, 0, 0.3),
        rgba(255, 255, 255, 0.1)
      );
      border-radius: inherit;
      animation: swirl 4s linear infinite;
      z-index: 0;
    }
    .icon-tornado-btn:hover {
      background: linear-gradient(145deg, #111827, #000000);
      box-shadow: 0 0 30px rgba(9, 9, 9, 0.8),
        0 0 60px rgba(60, 82, 88, 0.6), 0 0 100px rgba(100, 110, 118, 0.5);
    }
    @keyframes swirl {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `}</style>
        </button>
        {/* Logo section */}
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-200 to-sky-500">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="relative w-16 h-16 flex items-center justify-center font-bold text-xl text-white overflow-hidden rounded-full group"
      >
         {isSidebarOpen ? (
            <X className="w-[3rem] h-[3rem] text-gray-200 z-10 " />
          ) : (
            <Menu className="w-[2rem] h-[2rem] text-gray-200 z-10" />
          )}
        {/* Tornado funnel layers */}
        <span className="absolute inset-0 -z-10 animate-spin-slow">
          <span className="absolute w-[200%] h-[200%] left-[-50%] top-[-50%] bg-[conic-gradient(at_50%_50%,_rgba(0,0,0,0.8),transparent_30%)] blur-[30px] opacity-70" />
          <span className="absolute w-[150%] h-[150%] left-[-25%] top-[-25%] bg-[conic-gradient(at_50%_50%,_rgba(50,50,50,0.6),transparent_40%)] blur-[20px] opacity-80" />
          <span className="absolute w-[120%] h-[120%] left-[-10%] top-[-10%] bg-[conic-gradient(at_50%_50%,_rgba(80,80,80,0.5),transparent_50%)] blur-[15px] opacity-90" />
        </span>

        {/* Hover elongation (terrain stretch effect) */}
        <span className="absolute inset-0 -z-20 transition-transform duration-500 ease-in-out group-hover:scale-y-125 group-hover:blur-[25px]" />
      </button>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 6s linear infinite;
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
        {/* <div className="flex items-center justify-center">
          <div className="bg-green-300 w-[3rem] md:w-[5rem] h-[1rem] border-s-[40px] border-s-amber-700 rounded-s-full"></div>
          <div className="w-2 h-10 bg-amber-800"></div>
          <div className="border-[1.5px] border-red-400 rounded-full">
            <img src="./tree.svg" alt="tree" width={50} height={50} />
          </div>
          <div className="bg-green-300 w-[5rem] md:w-[10rem] h-[1.5rem] border-e-[30px] border-e-cyan-800 rounded-ee-4xl"></div>
        </div> */}
      </header>

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        setSelectedGame={setSelectedGame}
        setMode={setMode}
      />
    </div>
  )
}

export default Header;
