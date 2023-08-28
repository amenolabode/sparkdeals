import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth_context";
import { FaArrowCircleDown, FaArrowDown, FaCaretDown, FaUser } from "react-icons/fa";

export const Header = ({ noInCart, handleOpenCart }) => {
  const [activePage, setActivePage] = useState("/");
  const [open, setOpen] = useState(false)
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

    }
  }


  return (
    <div className="bg-white fixed items-center top-0 z-50 flex flex-col w-full h-auto border-b border-[#FAFAFA]/[.20]">
      <div className="flex md:justify-between w-full px-[16px] lg:px-[64px] h-[88px] py-[16px] bg-white max-w-[2880px] items-center">
        {/* <HiMenu
          className="text-xl md:hidden ml-[16px]"
          onClick={() => setOpenNavBar(true)}
        /> */}

        <div className="flex items-center w-full md:w-fit">
          <img
            src="./assets/logo.png"
            alt=""
            className="cursor-pointer h-[32px]"
            onClick={() => {
              handleLinkClick("/");
            }}
          />
          <p className="text-green ml-2">DEALS</p>
        </div>


        <div className="flex text-green items-center space-x-8 justify-end text-[16px] font-[400]">
          {activePage === "/" && <div className="flex space-x-8">
            {/* <h2
            className={`w-fit cursor-pointer hover:text-gray-600 ${"text-green font-medium"}`}
          >
            <a href="https://joinspark.app">Spark Website</a>
          </h2> */}
            <Link to="/" onClick={handleOpenCart}>
              <h2
                className={`font-medium mr-[16px] md:mr-0 cursor-pointer hover:text-gray-600 flex`}
              >
                Cart{" "}
                <div className="ml-2 px-[6px] text-[10px] h-4 w-4 text-center items-center flex justify-center bg-red-900 text-white rounded-[40px]">
                  {noInCart}
                </div>
              </h2>
            </Link></div>}

          {activePage === "/445bde24-bbb1-47a9-82aa-c4c3fd956c14" &&
            <div className="md:flex hidden space-x-8">
              <h3 className="font-medium">
                {user && user.email}
              </h3>
              <h2
                onClick={handleLogOut}
                className={`font-medium mr-[16px] md:mr-0 cursor-pointer hover:text-gray-600 flex 
              `}
              >
                SignOut{" "}
              </h2>
            </div>}
          {activePage === "/445bde24-bbb1-47a9-82aa-c4c3fd956c14" &&
            <div
              className="relative pr-[16px] flex md:hidden items-center gap-2"
              onClick={() => { setOpen(!open) }}>
              <FaCaretDown />
              <div className="bg-green text-white rounded-full p-2"><FaUser /></div>

              {open &&
                <div className="absolute top-8 right-4 bg-white p-4 rounded-md md:hidden space-y-6 border border-gray-100 shadow-lg">
                  <h3 className="font-medium">
                    {user && user.email}
                  </h3>
                  <h2
                    onClick={handleLogOut}
                    className={`font-medium mr-[16px] md:mr-0 cursor-pointer hover:text-gray-600 flex 
              `}
                  >
                    SignOut{" "}
                  </h2>
                </div>}
            </div>


          }

        </div>
      </div>
    </div>
  );
};
