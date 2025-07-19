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
      <div className="flex justify-around border-2 w-full"> 
        <div className="bg-teal-50 w-[50px] h-[50px] rounded-[50%] text-black  ">X</div>

        <div className="bg-teal-50 w-[50px] h-[50px] rounded-[50%] text-black  ">O</div>
      </div>
    </div>
  );
};

export default page;
