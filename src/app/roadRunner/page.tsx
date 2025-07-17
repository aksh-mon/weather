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
      className="w-full h-screen"
    ></div>
  );
};

export default page;
