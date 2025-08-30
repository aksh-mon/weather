
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
          className="icon-tornado-btn relative flex items-center justify-center w-[3.5rem] h-[3.5rem] rounded-lg bg-gray-600"
          style={{ rotate: "-35deg" }}
        >
          {isSidebarOpen ? (
            <X className="w-[3rem] h-[3rem] text-gray-200 z-10" />
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
      box-shadow: 0 0 30px rgba(0, 255, 200, 0.8),
        0 0 60px rgba(0, 200, 255, 0.6), 0 0 100px rgba(0, 150, 255, 0.5);
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

        <div className="">
        </div>
        {/* Logo section */}
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
