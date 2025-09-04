
'use client'
import { Menu, X } from 'lucide-react';
import React, { useState } from 'react'
import Sidebar from '../compo/sidebar';


interface HeaderProps {
  setSelectedGame:  React.Dispatch<React.SetStateAction<string>>;
  setMode: React.Dispatch<React.SetStateAction<"game" | "error">>;
}

const Header: React.FC<HeaderProps> = ({ setSelectedGame, setMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      <header style={{ position: 'absolute', bottom: '0', scrollbarWidth: 'none' }} className="overflow-hidden bg-transparent w-full h-[10vh]  relative z-[9999] flex justify-end items-center px-4">
        
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='cursor-pointer bg-amber-300 p-2.5'
          style={{
            font: "inherit",
            border: "0",
            textShadow: "0 0.0625em 0 #fff",
          }}
        
        >
           {isSidebarOpen ? (
            <X className=" text-white" />
          ) : (
            <Menu className=" text-white font-bold" />
          )}

        </button>

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
