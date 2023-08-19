import { Divider } from "antd";
import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
} from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

const SparkFooter = () => {
  // const navigate = useNavigate();
  return (
    <div className="mt-24 p-[16px] md:p-[64px]">
      <Divider className="bg-[#bdbdbd]" />
      <div className="flex mt-24">
        {/* <div className="w-2/3">
          <img src="/assets/logo.png" alt="" className="w-[120px]" />
        </div> */}
        <div className="flex gap-[32px]">
          <FaTwitter
            size={24}
            color={`#5eba48`}
            className="cursor-pointer"
            onClick={() =>
              window.open("https://twitter.com/JoinSparkApp", "_blank")
            }
          />
          <FaFacebook
            size={24}
            color={`#5eba48`}
            className="cursor-pointer"
            onClick={() =>
              window.open("https://www.facebook.com/joinsparkclub/", "_blank")
            }
          />
          <FaInstagram
            size={24}
            color={`#5eba48`}
            className="cursor-pointer"
            onClick={() =>
              window.open("https://instagram.com/joinsparkapp", "_blank")
            }
          />
          <FaLinkedin
            size={24}
            color={`#5eba48`}
            className="cursor-pointer"
            onClick={() =>
              window.open(
                "https://www.linkedin.com/company/joinsparkapp/about/",
                "_blank"
              )
            }
          />
          <FaTiktok
            size={24}
            color={`#5eba48`}
            className="cursor-pointer"
            onClick={() =>
              window.open("https://www.tiktok.com/@joinsparkapp", "_blank")
            }
          />
        </div>
      </div>
      <div className="w-[90%] md:w-1/3 mt-12 text-gray-700 mb-24 md:mb-0">
        Use of this Website implies an acceptance of our{" "}
        <a href="https://www.joinspark.app/terms/" className="text-blue-500">
          Terms of Use
        </a>{" "}
        and
        <a
          href="https://www.joinspark.app/privacy-policy-web/"
          className="text-blue-500"
        >
          {" "}
          Privacy Policy
        </a>
        . Spark is a service of FiClub Ghana Ltd. :copyright: 2023 FiClub Ghana
        Ltd
      </div>
    </div>
  );
};

export default SparkFooter;
