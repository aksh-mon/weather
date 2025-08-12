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
import { Menu, Shell, X } from "lucide-react";

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
    <div className="bg-amber-200 border-[.5rem] border-dashed border-emerald-300 overflow-hidden relative z-[1000]">
      {/* HEADER */}
      <header className="bg-[#fff] w-[99%] mx-auto  h-[10vh] border-b-2 border-b-cyan-700 fixed left-0 right-0 top-0 z-[999] flex justify-center items-center ">
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
        <div
          className={`min-h-[90vh] w-[20vw] absolute top-[9vh] z-[99] transform transition-transform duration-1000 ease-in-out  ${
            isSidebarOpen ? "translate-x-1.5" : "-translate-x-[300%]"
          }`}
        >
          <div className="flex flex-col items-start justify-between gap-5">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="self-end m-2 bg-white h-fit w-fit rounded-full "
            >
              <X className="w-6 h-6" />
            </button>

            <button
              className ="text-xl bg-transparent border w-fit h-[6vh] px-5 text-left p-2 flex items-center ml-[15px] rounded-3xl  hover:border-red-200 hover:text-black hover:[text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)]  text-[#ccc] [text-shadow:_1px_1px_3px_rgba(0,0,0,0.4)] hover:border-[5px] hover:bg-white  cursor-pointer "
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
              <p>FISHMON </p>
            </button>
            
          </div>
        </div>

      {/* PAGE CONTENT */}
      <div className="bg-white h-full w-full pt-10">{renderGame()}</div>
      <Tree />
      <Footnote />
    </div>
  );
}
