/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import App from "../app/app/page";
import Sudoku from "../app/sudoku/page";
import Footnote from "../app/footnote/page";
import FlappyBirdGame from "./flappyBird/page";
import Contra from "./contra/page";
import Snake from "./snake/page";
import Ludo from "./ludo/page";
import Tree from "../app/compo/trees";
import { CircleQuestionMark, Menu, Shell, X } from "lucide-react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState("app"); // default to App

  const renderGame = () => {
    switch (selectedGame) {
      case "ludo":
        return <Ludo />;
      case "snake":
        return <Snake />;
      case "sudoku":
        return <Sudoku />;
      case "flappy":
        return <FlappyBirdGame />;
      case "contra":
        return <Contra />;
      case "app":
        return <App />;
      default:
        return <App />;
    }
  };

  return (
    <div className="bg-amber-200 border-[.5rem] border-dashed border-emerald-300 overflow-hidden relative z-[1000] font-mono ">
      {/* HEADER */}
      <header className="bg-[#fff] w-[99%] mx-auto  h-[10vh] border-b-2 border-b-cyan-700 fixed left-0 right-0 top-0 z-[999] flex justify-center items-center">
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu className=" w-[2rem] h-[2rem]  ml-3" />
        </button>
        <div className="flex items-center w-full justify-center">
          <div className="bg-green-300 w-[3rem] md:w-[5rem] h-[1rem]  border-s-[40px] border-s-amber-700 rounded-s-full"></div>
          <div className="w-2 h-10 bg-amber-800"></div>
          <div className="border-[1.5px] border-red-400 rounded-full ">
            <img
              src="./tree.svg"
              alt=""
              width={50}
              height={50}
              className="animate-none"
            />
          </div>
          <div className="bg-green-300 w-[5rem] md:w-[10rem] h-[1rem] border-e-[30px] border-e-cyan-800 rounded-ee-4xl"></div>
        </div>
      </header>

      {/* SIDEBAR */}

      {/* PAGE CONTENT */}
      <div className="bg-white h-[90vh] w-full">
        <div className="relative top-[10vh]">
          <div
            className="flex flex-col items-center justify-center min-h-[80vh] bg-white text-black p-6"
            style={{
              fontFamily: "monospace",
            }}
          >
            {/* Moving Tree */}
            <div
              className="relative"
              style={{
                animation: "sway 3s ease-in-out infinite",
              }}
            >
              <svg width="80px" height="80px" viewBox="0 -0.5 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg"  className="si-glyph si-glyph-tree">
                <title>929</title>
                <defs>
                </defs>
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <path d="M14.779,12.18 L11.795,8.501 C11.795,8.501 13.396,8.937 13.57,8.937 C14.035,8.937 13.765,8.42 13.57,8.223 L11.185,5.192 C11.185,5.192 12.333,4.918 12.75,4.918 C13.168,4.918 12.947,4.401 12.75,4.204 L9.4,0.061 C9.203,-0.136 8.883,-0.136 8.686,0.061 L5.291,4.161 C5.093,4.358 4.805,4.876 5.291,4.876 C5.777,4.876 6.913,5.192 6.913,5.192 L4.325,8.079 C4.127,8.276 3.768,8.793 4.325,8.793 C4.644,8.793 6.275,8.502 6.275,8.502 L3.317,12.189 C3.12,12.385 2.76,12.903 3.317,12.903 C3.874,12.903 8.008,11.896 8.008,11.896 L8.008,14.941 C8.008,15.478 8.444,15.914 8.983,15.914 C9.52,15.914 9.998,15.478 9.998,14.941 L9.998,11.896 C9.998,11.896 14.373,12.895 14.778,12.895 C15.183,12.895 14.976,12.376 14.779,12.18 L14.779,12.18 Z" fill="#434343" className="si-glyph-fill">

                  </path>
                </g>
              </svg>
          
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold mt-6">Page Not Available</h1>
            <p className="text-gray-400 text-center mt-2">
              The page you requested is not available. Please try again later.
            </p>

            {/* Neon Button */}
            <button
              className="mt-6 px-6 py-3 rounded-lg text-white font-bold text-lg transition-all duration-500"
              style={{
                backgroundColor: "#ccc",
                boxShadow: "0 0 20px #ccc, 0 0 40px #ccc",
                animation: "glow 1.5s infinite alternate",
              }}
              onClick={() => alert("Notification Sent!")}
            >
              Send Notification
            </button>

            {/* Inline Keyframes */}
            <style jsx>{`
              @keyframes sway {
                0% {
                  transform: rotate(0deg);
                }
                50% {
                  transform: rotate(3deg);
                }
                100% {
                  transform: rotate(0deg);
                }
              }
              @keyframes glow {
                from {
                  box-shadow: 0 0 10px #000, 0 0 20px #c3c3c3;
                }
                to {
                  box-shadow: 0 0 20px #000, 0 0 40px #c2c2c2;
                }
              }
            `}</style>
          </div>
        </div>
      </div>
      <div
        className={` h-[81vh] min-h-[81vh] w-[30vw] min-w-[50vw] absolute top-[9vh] z-[99] transform transition-transform duration-1000 ease-in-out  ${isSidebarOpen ? "translate-x-1.5" : "-translate-x-[300%] "
          }`}
      >
        <div
          style={{ scrollbarWidth: "none" }}
          className="flex flex-col items-start justify-start gap-5 h-[81vh] border overflow-scroll"
        >
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="self-end m-2 bg-white h-fit w-fit rounded-full "
          >
            <X className="w-6 h-6" />
          </button>

          <button
            className="text-xl bg-transparent border w-fit h-[6vh] px-5 text-left p-2 flex items-center ml-[15px] rounded-3xl  hover:border-red-200 hover:text-black hover:[text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)]  text-[#ccc] [text-shadow:_1px_1px_3px_rgba(0,0,0,0.4)] hover:border-[5px] hover:bg-white  cursor-pointer "
            onClick={() => {
              setSelectedGame("app");
              setIsSidebarOpen(false);
            }}
          >
            <Shell
              color="#ccc"
              className="mr-2 animate-spin stroke-amber-700 group-hover:stroke-black"
            />{" "}
            <p> HOME </p>
          </button>
          <button
            className=" text-xl bg-transparent border w-fit h-[6vh] px-5 text-left p-2 flex items-center ml-[30px] rounded-3xl  hover:border-red-200 hover:text-black hover:[text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)]  text-[#ccc] [text-shadow:_1px_1px_3px_rgba(0,0,0,0.4)] hover:border-[5px] hover:bg-white  cursor-pointer "
            onClick={() => {
              setSelectedGame("ludo");
              setIsSidebarOpen(false);
            }}
          >
            <Shell
              color="#ccc"
              className="mr-2 animate-spin stroke-amber-700 group-hover:stroke-black"
            />{" "}
            <p> LUDO </p>
          </button>
          <button
            className=" text-xl bg-transparent border w-fit h-[6vh] px-5 text-left p-2 flex items-center ml-[45px] rounded-3xl  hover:border-red-200 hover:text-black hover:[text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)]  text-[#ccc] [text-shadow:_1px_1px_3px_rgba(0,0,0,0.4)] hover:border-[5px] hover:bg-white  cursor-pointer "
            onClick={() => {
              setSelectedGame("snake");
              setIsSidebarOpen(false);
            }}
          >
            <Shell
              color="#ccc"
              className="mr-2 animate-spin  stroke-amber-700 group-hover:stroke-black"
            />{" "}
            <p> SNAKE </p>
          </button>
          <button
            className=" text-xl bg-transparent border w-fit h-[6vh] px-5 text-left p-2 flex items-center ml-[60px] rounded-3xl  hover:border-red-200 hover:text-black hover:[text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)]  text-[#ccc] [text-shadow:_1px_1px_3px_rgba(0,0,0,0.4)] hover:border-[5px] hover:bg-white  cursor-pointer "
            onClick={() => {
              setSelectedGame("sudoku");
              setIsSidebarOpen(false);
            }}
          >
            <Shell
              color="#ccc"
              className="mr-2 animate-spin  stroke-amber-700 group-hover:stroke-black"
            />{" "}
            <p> SUDOKU </p>
          </button>
          <button
            className=" text-xl bg-transparent border w-fit h-[6vh] px-5 text-left p-2 flex items-center ml-[75px] rounded-3xl  hover:border-red-200 hover:text-black hover:[text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)]  text-[#ccc] [text-shadow:_1px_1px_3px_rgba(0,0,0,0.4)] hover:border-[5px] hover:bg-white  cursor-pointer "
            onClick={() => {
              setSelectedGame("contra");
              setIsSidebarOpen(false);
            }}
          >
            <Shell
              color="#ccc"
              className="mr-2 animate-spin  stroke-amber-700 group-hover:stroke-black"
            />{" "}
            <p> TETRIS </p>
          </button>
          <button
            className=" text-xl bg-transparent border w-fit h-[6vh] px-5 text-left p-2 flex items-center ml-[90px] rounded-3xl  hover:border-red-200 hover:text-black hover:[text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)]  text-[#ccc] [text-shadow:_1px_1px_3px_rgba(0,0,0,0.4)] hover:border-[5px] hover:bg-white active:bg-white cursor-pointer "
            onClick={() => {
              setSelectedGame("flappy");
              setIsSidebarOpen(false);
            }}
          >
            <Shell
              color="#ccc "
              className="mr-2 animate-spin  stroke-amber-700 group-hover:stroke-black"
            />{" "}
            <p>@FISHMON </p>
          </button>
          <button
            className="text-xl bg-transparent border w-fit h-[6vh] px-5 text-left p-2 flex items-center ml-[15px] rounded-3xl  hover:border-red-200 hover:text-black hover:[text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)]  text-[#ccc] [text-shadow:_1px_1px_3px_rgba(0,0,0,0.4)] hover:border-[5px] hover:bg-white  cursor-pointer "
            onClick={() => {
              setSelectedGame("app");
              setIsSidebarOpen(false);
            }}
          >
            <Shell
              color="#ccc"
              className="mr-2 animate-spin stroke-amber-700 group-hover:stroke-black"
            />{" "}
            <p> HOME </p>
          </button>
          <button
            className=" text-xl bg-transparent border w-fit h-[6vh] px-5 text-left p-2 flex items-center ml-[30px] rounded-3xl  hover:border-red-200 hover:text-black hover:[text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)]  text-[#ccc] [text-shadow:_1px_1px_3px_rgba(0,0,0,0.4)] hover:border-[5px] hover:bg-white  cursor-pointer "
            onClick={() => {
              setSelectedGame("ludo");
              setIsSidebarOpen(false);
            }}
          >
            <Shell
              color="#ccc"
              className="mr-2 animate-spin stroke-amber-700 group-hover:stroke-black"
            />{" "}
            <p> LUDO </p>
          </button>
          <button
            className=" text-xl bg-transparent border w-fit h-[6vh] px-5 text-left p-2 flex items-center ml-[45px] rounded-3xl  hover:border-red-200 hover:text-black hover:[text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)]  text-[#ccc] [text-shadow:_1px_1px_3px_rgba(0,0,0,0.4)] hover:border-[5px] hover:bg-white  cursor-pointer "
            onClick={() => {
              setSelectedGame("snake");
              setIsSidebarOpen(false);
            }}
          >
            <Shell
              color="#ccc"
              className="mr-2 animate-spin  stroke-amber-700 group-hover:stroke-black"
            />{" "}
            <p> SNAKE </p>
          </button>
          <button
            className=" text-xl bg-transparent border w-fit h-[6vh] px-5 text-left p-2 flex items-center ml-[60px] rounded-3xl  hover:border-red-200 hover:text-black hover:[text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)]  text-[#ccc] [text-shadow:_1px_1px_3px_rgba(0,0,0,0.4)] hover:border-[5px] hover:bg-white  cursor-pointer "
            onClick={() => {
              setSelectedGame("sudoku");
              setIsSidebarOpen(false);
            }}
          >
            <Shell
              color="#ccc"
              className="mr-2 animate-spin  stroke-amber-700 group-hover:stroke-black"
            />{" "}
            <p> SUDOKU </p>
          </button>
          <button
            className=" text-xl bg-transparent border w-fit h-[6vh] px-5 text-left p-2 flex items-center ml-[75px] rounded-3xl  hover:border-red-200 hover:text-black hover:[text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)]  text-[#ccc] [text-shadow:_1px_1px_3px_rgba(0,0,0,0.4)] hover:border-[5px] hover:bg-white  cursor-pointer "
            onClick={() => {
              setSelectedGame("contra");
              setIsSidebarOpen(false);
            }}
          >
            <Shell
              color="#ccc"
              className="mr-2 animate-spin  stroke-amber-700 group-hover:stroke-black"
            />{" "}
            <p> TETRIS </p>
          </button>
          <button
            className=" text-xl bg-transparent border w-fit h-[6vh] px-5 text-left p-2 flex items-center ml-[90px] rounded-3xl  hover:border-red-200 hover:text-black hover:[text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)]  text-[#ccc] [text-shadow:_1px_1px_3px_rgba(0,0,0,0.4)] hover:border-[5px] hover:bg-white active:bg-white cursor-pointer "
            onClick={() => {
              setSelectedGame("flappy");
              setIsSidebarOpen(false);
            }}
          >
            <Shell
              color="#ccc "
              className="mr-2 animate-spin  stroke-amber-700 group-hover:stroke-black"
            />{" "}
            <p>@FISHMON </p>
          </button>
        </div>
      </div>
      <Tree />
      <Footnote />
    </div>
  );
}
