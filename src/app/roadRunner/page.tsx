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
      <div className="flex justify-around  border-2"> 
        <div className="w-3 h-3 rounded-3xl bg-amber-50"></div>

        <div className="w-3 h-3 rounded-3xl bg-amber-50"></div>
      </div>
    </div>
  );
};

export default page;
