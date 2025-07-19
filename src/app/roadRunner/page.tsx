import React from "react";
import BgImage from "../app/bg/bg3.jpg";
import { Cross, Badge, Rotate3DIcon } from "lucide-react";

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
      <div className="flex lg:justify-between  w-full min-h-screen p-5 items-center sm:justify-center ">
        <div className="lg:flex sm:hidden flex-col items-center w-[200px] ">
          <button className="lg:flex sm:hidden bg-transparent  border-[2px] border-white w-[70px] h-[70px] rounded-[50%] text-white  font-bold font-mono text-5xl  flex justify-center items-center  hover:shadow-[1px_1px_12px_12px_rgba(255,255,255,0.3)] hover:border-transparent hover:animate-spin ">
            <Cross color="red" size={38} className="" />
          </button>
          <div className="w-full flex justify-between">
            <button className="lg:flex sm:hidden bg-transparent  border-[2px] border-white w-[70px] h-[70px] rounded-[50%] text-white  font-bold font-mono text-5xl  flex justify-center items-center  hover:shadow-[1px_1px_12px_12px_rgba(255,255,255,0.3)] hover:border-transparent hover:animate-spin ">
              <Cross color="red" size={38} className="" />
            </button>
            <button className="lg:flex sm:hidden bg-transparent  border-[2px] border-white w-[70px] h-[70px] rounded-[50%] text-white  font-bold font-mono text-5xl  flex justify-center items-center  hover:shadow-[1px_1px_12px_12px_rgba(255,255,255,0.3)] hover:border-transparent hover:animate-spin ">
              <Cross color="red" size={38} className="" />
            </button>
          </div>
          <button className="lg:flex sm:hidden bg-transparent  border-[2px] border-white w-[70px] h-[70px] rounded-[50%] text-white  font-bold font-mono text-5xl  flex justify-center items-center  hover:shadow-[1px_1px_12px_12px_rgba(255,255,255,0.3)] hover:border-transparent hover:animate-spin ">
            <Cross color="red" size={38} className="" />
          </button>
        </div>
        <p className=" text-white lg:hidden sm:flex sm:items-center sm:gap-4 ">
          Note Rotate{" "}
          <Rotate3DIcon size={38} color="red" className="animate-spin" /> your
          device{" "}
        </p>
        <div className="lg:flex sm:hidden flex-col items-center w-[200px]">
        <button className="lg:flex sm:hidden bg-transparent border-[2px] border-white w-[70px] h-[70px] rounded-[50%] text-white font-bold font-mono text-5xl flex justify-center items-center    hover:shadow-[1px_1px_12px_12px_rgba(255,255,255,0.3)] hover:border-transparent hover:animate-spin ">
          <Badge color="red" size={38} />
        </button>
        <div className="w-full flex justify-between">
        <button className="lg:flex sm:hidden bg-transparent border-[2px] border-white w-[70px] h-[70px] rounded-[50%] text-white font-bold font-mono text-5xl flex justify-center items-center    hover:shadow-[1px_1px_12px_12px_rgba(255,255,255,0.3)] hover:border-transparent hover:animate-spin ">
          <Badge color="red" size={38} />
        </button>
        <button className="lg:flex sm:hidden bg-transparent border-[2px] border-white w-[70px] h-[70px] rounded-[50%] text-white font-bold font-mono text-5xl flex justify-center items-center    hover:shadow-[1px_1px_12px_12px_rgba(255,255,255,0.3)] hover:border-transparent hover:animate-spin ">
          <Badge color="red" size={38} />
        </button>
        </div>

        <button className="lg:flex sm:hidden bg-transparent border-[2px] border-white w-[70px] h-[70px] rounded-[50%] text-white font-bold font-mono text-5xl flex justify-center items-center    hover:shadow-[1px_1px_12px_12px_rgba(255,255,255,0.3)] hover:border-transparent hover:animate-spin ">
          <Badge color="red" size={38} />
        </button>
        </div>
      </div>
    </div>
  );
};
export default page;
