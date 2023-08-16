import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { HiMenu } from "react-icons/hi";
import { Drawer } from "antd";

export const Header = ({ noInCart }) => {
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

  const MobileSideNavItems = () => {
    return (
      <div className="flex justify-start text-black  w-full h-full pl-[20px] pr-[100px] py-8">
        <div className="flex justify-end">
          <AiOutlineClose
            className="text-2xl font-bold text-white"
            onClick={() => setOpenNavBar(false)}
          />
        </div>
        <div className="flex-col items-center justify-center w-full mt-24 space-y-8 text-black">
          <h1 className="mb-4 text-[20px] font-semibold ">Home</h1>
        </div>
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
          // anchor={"left"}
          key="right"
          onClose={() => setOpenNavBar(false)}
        >
          {MobileSideNavItems()}
        </Drawer>
        <img
          src="./assets/logo.png"
          alt=""
          className="ml-4 md:ml-0 cursor-pointer h-[32px]"
          onClick={() => {
            handleLinkClick("/");
          }}
        />

        <div className="md:flex hidden text-black items-center space-x-8 justify-end text-[16px] font-[400]">
          <Link to="/" onClick={() => handleLinkClick("/")}>
            <h2
              className={`cursor-pointer hover:text-gray-600 ${
                activePage === "/" ? "text-green font-medium" : "text-grey"
              }`}
            >
              Home
            </h2>
          </Link>
          <Link to="/" onClick={() => handleLinkClick("/")}>
            <h2
              className={`cursor-pointer hover:text-gray-600 flex ${
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
