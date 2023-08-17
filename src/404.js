import React from "react";
import { Header } from "./components/header";
import Lottie from "lottie-react";
import animationData from "./assets/animation_llfho8x2.json";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
    
  const navigate = useNavigate();
  return (
    <div className="bg-white h-screen">
      <Header />
      <div className="h-[70vh] md:h-screen w-full items-center place-content-center flex flex-col">
        <Lottie className="h-80" animationData={animationData} />
        <p className="text-[36px] font-medium text-green">Page not found</p>
        <div
          className={`text-[18px] ${"bg-green hover:bg-[#0f5c2e] text-white"} text-[16px] mt-8 text-center cursor-pointer capitalize  px-8 py-4 rounded-md w-fit`}
          onClick={() => {navigate("/")}}
        >
          {" "}
          Back to home
        </div>
      </div>
    </div>
  );
};

export default Page404;
