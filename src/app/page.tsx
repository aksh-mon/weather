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
import Toggle from "../app/compo/toggle";
import Typewriter from "../app/compo/typewritwertext";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState("app");

  const [bgColor, setBgColor] = useState("");
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
      <header className=" bg-white w-[99%] mx-auto  h-[10vh] border-b-2 border-b-cyan-700 fixed left-0 right-0 top-0 z-[999] flex justify-center items-center">
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu className=" w-[2rem] h-[2rem]  ml-3 text-gray-700" />
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
      <div style={{ backgroundColor: `${bgColor}`, transition: "background-color 0.3s ease-in-out" }} className=" h-[90vh] w-full">
        <div className="relative top-[10vh]">
          <div
            style={{ backgroundColor: `${bgColor}` }}
            className="flex flex-col items-center justify-center min-h-[80vh]  text-black p-6"
          >
            {/* Moving Tree */}
            <div
              className="relative"
              style={{
                animation: "sway 3s ease-in-out infinite",
              }}
            >
              <svg
                width="150"
                height="200"
                viewBox="0 0 200 300"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Trunk */}
                <rect
                  x="90"
                  y="180"
                  width="20"
                  height="80"
                  fill='#aa7050'
                />
                {/* Pine layers */}
                <polygon
                  points="100,30 40,100 160,100"
                  fill="#79E056"
                />
                <polygon
                  points="100,60 50,140 150,140"
                  fill="#79E056"
                />
                <polygon
                  points="100,100 60,180 140,180"
                  fill="#79E056"
                />
              </svg>

            </div>

            {/* Error Message */}
            <h1 className='mt-[-5%] text-2xl text-black' style={{ fontFamily: 'Nabla' }}>404</h1>
            <h1 className={"text-2xl font-bold mt-1 "}
              style={{ color: bgColor === "#E5E5E5" ? "black" : "white" }}>Page Not Available</h1>
            <Typewriter
              text={[
                "working on our website ⛔",
                "site under construction 🛰️",
                "happy visiting 🫡"
              ]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              variableSpeed={undefined}
              onSentenceComplete={undefined}
            />

            {/* Neon Button */}
            <button
              className="mt-6 px-6 py-3 rounded-lg text-white font-bold text-lg transition-all duration-500"
              style={{
                backgroundColor: "#ffcc60",
                boxShadow: "0 0 20px #ffcc60, 0 0 40px #ffcc60",
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
        className={` h-[81vh] min-h-[81vh] lg:min-w-[20vw] sm:min-w-[30vw] absolute top-[9vh] z-[99] transform transition-transform duration-1000 ease-in-out  ${isSidebarOpen ? "translate-x-1.5" : "-translate-x-[300%] ml-[-10%]"
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
            className="text-xl bg-transparent border w-fit h-[6vh] px-5 text-left p-2 flex items-center ml-[15px] rounded-3xl   hover:text-black hover:[text-shadow:_2px_2px_4px_rgba(0,0,0,0.5)]  text-[#ccc] [text-shadow:_1px_1px_3px_rgba(0,0,0,0.4)] hover:bg-white  cursor-pointer "
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
        </div>
      </div>

      <Toggle onToggle={setBgColor} />
      <Tree />


      <Footnote />
    </div>
  );
}
