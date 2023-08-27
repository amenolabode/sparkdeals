import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
// import { HiMenu } from "react-icons/hi";
import { Drawer } from "antd";
import { useAuth } from "../context/auth_context";

export const Header = ({ noInCart, handleOpenCart, adminSignOut }) => {
  const [activePage, setActivePage] = useState("/");
  const [openNavBar, setOpenNavBar] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth()

  useEffect(() => {
    const currentPath = window.location.pathname;
    setActivePage(currentPath);
  }, []);

  const handleLinkClick = (path) => {
    navigate(path);
    setActivePage(path);
  };

  const handleLogOut = async () => {
    try {
      await signOut()
      navigate('/445bde24-bbb1-47a9-82aa-c4c3fd956c14-signin')
    } catch (error) {
      console.log(error)
    }
  }

  const MobileSideNavItems = () => {
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
                className={`mb-4 text-[20px] font-semibold cursor-pointer hover:text-gray-600 ${activePage === "/" ? "text-green font-medium" : "text-grey"
                  }`}
              >
                Home
              </h2>
            </Link>
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
    <div className="fixed items-center top-0 z-50 flex flex-col w-full h-auto border-b border-[#FAFAFA]/[.20]">
      <div className="flex md:justify-between w-full md:px-[64px] h-[88px] py-[16px] bg-white max-w-[2880px] items-center">
        {/* <HiMenu
          className="text-xl md:hidden ml-[16px]"
          onClick={() => setOpenNavBar(true)}
        /> */}
        <Drawer
          open={openNavBar}
          placement="left"
          // anchor={"left"}
          key="right"
          onClose={() => setOpenNavBar(false)}
        >
          {MobileSideNavItems(handleOpenCart)}
        </Drawer>
        <div className="flex items-center w-full md:w-fit">
          <img
            src="./assets/logo.png"
            alt=""
            className="ml-4 md:ml-0 cursor-pointer h-[32px]"
            onClick={() => {
              handleLinkClick("/");
            }}
          />
          <p className="text-green ml-2">DEALS</p>
        </div>

        <div className="flex text-black items-center space-x-8 justify-end text-[16px] font-[400]">
          <h2
            className={`${activePage === "/" ? "block" : "hidden"} w-fit cursor-pointer hover:text-gray-600 ${"text-green font-medium"}`}
          >
            <a href="https://joinspark.app">Spark Website</a>
          </h2>

          <Link to="/" onClick={handleOpenCart}>
            <h2
              className={`text-green font-medium mr-[16px] md:mr-0 cursor-pointer hover:text-gray-600 flex ${activePage === "/" ? "block" : "hidden"
                }`}
            >
              Cart{" "}
              <div className="ml-2 px-[6px] text-[10px] h-4 w-4 text-center items-center flex justify-center bg-red-900 text-white rounded-[40px]">
                {noInCart}
              </div>
            </h2>
          </Link>
          <h3 className="text-green font-medium">{user && user.email}</h3>

          <h2
            onClick={handleLogOut}
            className={`text-green font-medium mr-[16px] md:mr-0 cursor-pointer hover:text-gray-600 flex ${activePage === "/445bde24-bbb1-47a9-82aa-c4c3fd956c14" ? "block" : "hidden"
              }`}
          >

            SignOut{" "}

          </h2>

        </div>
      </div>
    </div>
  );
};
