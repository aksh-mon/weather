
/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useState } from 'react'
import Typewriter from '../compo/typewritwertext';
import Toggle from '../compo/toggle';


const page= () => {
  const [bgColor, setBgColor] = useState("");
  return (
    <div>

      <div style={{ backgroundColor: `${bgColor}`, transition: "background-color 0.3s ease-in-out" }} className="h-[100vh] w-full ">
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
            <h1 className='mt-[-5%] text-2xl text-black neb' >404</h1>
            <h1 className={"text-2xl font-bold mt-1 "}
              style={{ color: bgColor === "#E5E5E5" ? "black" : "white" }}> Page Not Available</h1>
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
        <Toggle onToggle={setBgColor}/>
      </div>

    </div>
  )
}

export default page;