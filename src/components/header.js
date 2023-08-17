import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { HiMenu } from "react-icons/hi";
import { Drawer } from "antd";

export const Header = ({ noInCart, handleOpenCart }) => {
  const [activePage, setActivePage] = useState("/");
  const [openNavBar, setOpenNavBar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = window.location.pathname;
    setActivePage(currentPath);
  }, []);

  const handleLinkClick = (path) => {
    navigate(path);
    setActivePage(path);
  };

  const MobileSideNavItems = (handleOpenCart) => {
    return (
      <div className=" h-[90%] ">
        <div className="flex ">
          <AiOutlineClose
            className="text-2xl font-bold text-white"
            onClick={() => setOpenNavBar(false)}
          />
        </div>
        <div className="flex flex-col text-black  w-full h-full py-8">
          <div className="flex-col items-center justify-center w-full space-y-8 text-black">
            <Link to="/" onClick={() => handleLinkClick("/")}>
              <h2
                className={`mb-4 text-[20px] font-semibold cursor-pointer hover:text-gray-600 ${
                  activePage === "/" ? "text-green font-medium" : "text-grey"
                }`}
              >
                Home
              </h2>
            </Link>
            {/* <h1
              className="mb-4 text-[20px] font-semibold "
              onClick={handleOpenCart}
            >
              Open Cart
            </h1> */}
            <h1 className="mb-4 text-[20px] font-semibold">
              <a href="https://joinspark.app">Spark Website</a>
            </h1>
          </div>
        </div>
        <img
          className="relative bottom-3 w-[80px] place-content-end justify-end"
          src="./assets/logo.png"
          alt=""
        />
      </div>
    );
  };

  return (
    <div className="md:fixed items-center top-0 z-50 flex flex-col w-full h-auto border-b border-[#FAFAFA]/[.20]">
      <div className="flex md:justify-between w-full md:px-[64px] h-[88px] py-[16px] bg-white max-w-[2880px] items-center">
        <HiMenu
          className="text-xl md:hidden ml-[16px]"
          onClick={() => setOpenNavBar(true)}
        />
        <Drawer
          open={openNavBar}
          placement="left"
          // anchor={"left"}
          key="right"
          onClose={() => setOpenNavBar(false)}
        >
          {MobileSideNavItems(handleOpenCart)}
        </Drawer>
        <div className="w-full">
          <img
            src="./assets/logo.png"
            alt=""
            className="ml-4 md:ml-0 cursor-pointer h-[32px]"
            onClick={() => {
              handleLinkClick("/");
            }}
          />
        </div>

        <div className="flex text-black items-center space-x-8 justify-end text-[16px] font-[400]">
          <Link to="/" onClick={() => handleLinkClick("/")}>
            <h2
              className={`hidden md:block cursor-pointer hover:text-gray-600 ${
                activePage === "/" ? "text-green font-medium" : "text-grey"
              }`}
            >
              Home
            </h2>
          </Link>
          <Link to="/" onClick={handleOpenCart}>
            <h2
              className={`mr-[16px] md:mr-0 cursor-pointer hover:text-gray-600 flex ${
                activePage === "/" ? "text-green font-medium" : "text-grey"
              }`}
            >
              Cart{" "}
              <div className="ml-2 px-[6px] text-[10px] h-4 w-4 text-center items-center flex justify-center bg-red-900 text-white rounded-[40px]">
                {noInCart}
              </div>
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
};
