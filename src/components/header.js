import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "../utils/routes";

export const Header = () => {
  const [activePage, setActivePage] = useState("/");
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
      <div className="flex justify-start  w-full h-full pl-[20px] pr-[100px] py-8 bg-black ">
        <div className="flex justify-end"></div>
        <div className="flex-col items-center justify-center w-full mt-24 space-y-8 text-black">
          <h1 className="mb-4 text-[20px] font-semibold ">Home</h1>
        </div>
      </div>
    );
  };


  return (
    <div className="fixed items-center top-0 z-50 flex flex-col w-full h-auto border-b border-[#FAFAFA]/[.20]">
      <div className="flex justify-between w-full px-[64px] py-[16px] bg-white max-w-[2880px] items-center">
        {/* <Drawer
            // open={openNavBar}
            anchor={"left"}
            className="w-[200px]"
            // onClose={() => setOpenNavBar(false)}
          >
            {MobileSideNavItems()}
          </Drawer> */}

        <h1
          className="text-black text-[32px] font-[700] cursor-pointer"
          onClick={() => {
            handleLinkClick("/");
          }}
        >
          Spark
        </h1>

        <div className="md:flex hidden text-black items-center space-x-8 justify-end text-[16px] font-[400]">
          <Link to="/" onClick={() => handleLinkClick("/")}>
            <h2
              className={`cursor-pointer hover:text-gray-600 ${
                activePage === "/" ? "text-[#ffffff] font-medium" : "text-grey"
              }`}
            >
              Home
            </h2>
          </Link>
          <Link to="/agenda" onClick={() => handleLinkClick("/agenda")}>
            <h2
              className={`cursor-pointer ${
                activePage === "/agenda"
                  ? "text-[#ffffff] font-medium"
                  : "text-grey"
              } hover:text-gray-600`}
            >
              Agenda
            </h2>
          </Link>
          <Link to="/partner" onClick={() => handleLinkClick("/partner")}>
            <h2
              className={`cursor-pointer ${
                activePage === "/partner"
                  ? "text-[#ffffff] font-medium"
                  : "text-grey"
              } hover:text-gray-600`}
             
            >
              Become a sponsor
            </h2>
          </Link>
          <div className="border bg-white h-6 opacity-25"></div>
          <div
            className="px-[18px] py-[12px] bg-gold font-[500] rounded-[8px] cursor-pointer"
            onClick={() => {
              navigate(paths.TICKET);
            }}
          >
            Buy tickets
          </div>
        </div>
      </div>
    </div>
  );
};
