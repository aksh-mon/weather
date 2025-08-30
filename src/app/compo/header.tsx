
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
      <header style={{ position: 'relative', bottom: '5rem', scrollbarWidth: 'none' }} className="overflow-hidden bg-transparent w-full h-[10vh]  relative z-[9999] flex justify-end items-center px-4">
        
        <button
        
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            font: "inherit",
            rotate:"-30deg",
            backgroundColor: "#f0f0f0",
            border: "0",
            color: "#242424",
            borderRadius: "0.5em",
            fontSize: "1.35rem",
            padding: "0.375em 1em",
            fontWeight: 600,
            textShadow: "0 0.0625em 0 #fff",
            boxShadow:
              "inset 0 0.0625em 0 0 #f4f4f4, 0 0.0625em 0 0 #efefef, 0 0.125em 0 0 #ececec, 0 0.25em 0 0 #e0e0e0, 0 0.3125em 0 0 #dedede, 0 0.375em 0 0 #dcdcdc, 0 0.425em 0 0 #cacaca, 0 0.425em 0.5em 0 #cecece",
            transition: "0.15s ease",
            cursor: "pointer",
          }}
          onMouseDown={(e) =>
          (e.currentTarget.style.boxShadow =
            "inset 0 0.03em 0 0 #f4f4f4, 0 0.03em 0 0 #efefef, 0 0.0625em 0 0 #ececec, 0 0.125em 0 0 #e0e0e0, 0 0.125em 0 0 #dedede, 0 0.2em 0 0 #dcdcdc, 0 0.225em 0 0 #cacaca, 0 0.225em 0.375em 0 #cecece")
          }
          onMouseUp={(e) =>
          (e.currentTarget.style.boxShadow =
            "inset 0 0.0625em 0 0 #f4f4f4, 0 0.0625em 0 0 #efefef, 0 0.125em 0 0 #ececec, 0 0.25em 0 0 #e0e0e0, 0 0.3125em 0 0 #dedede, 0 0.375em 0 0 #dcdcdc, 0 0.425em 0 0 #cacaca, 0 0.425em 0.5em 0 #cecece")
          }
        >
           {isSidebarOpen ? (
            <X className="text-2xl text-gray-900 z-10 " />
          ) : (
            <Menu className="text-2xl text-gray-900 z-10" />
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
