import React from "react";
import BgImage from "../app/bg/bg3.jpg";

const page = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${BgImage.src})`,
        backgroundSize: "cover",
        backgroundPositionX: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="w-full h-screen flex flex-col items-center justify-center "
    >
      <div className="flex justify-between  w-full p-5"> 
        <div className="bg-transparent w-[50px] h-[50px] rounded-[50%] text-black  font-bold font-mono text-2xl flex justify-center items-center  ">X</div>

        <div className="bg-transparent  w-[50px] h-[50px] rounded-[50%] text-black font-bold font-mono text-2xl flex justify-center items-center   ">O</div>
      </div>
    </div>
  );
};

export default page;
