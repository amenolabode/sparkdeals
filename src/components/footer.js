import { Divider } from "antd";
import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const SparkFooter = () => {
  return (
    <div className="mt-24 p-[64px]">
      <Divider className="bg-[#bdbdbd]" />
      <div className="flex mt-24">
        {/* <div className="w-2/3">
          <img src="/assets/logo.png" alt="" className="w-[120px]" />
        </div> */}
        <div className="flex gap-[32px]">
          <FaTwitter size={24} color={`#5eba48`} />
          <FaFacebook size={24} color={`#5eba48`} />
          <FaInstagram size={24} color={`#5eba48`} />
          <FaLinkedin size={24} color={`#5eba48`} />
        </div>
      </div>
      <div className="w-1/3 mt-12 text-gray-700">
        Use of this Website implies an acceptance of our{" "}
        <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a> . Spark
        is a service of FiClub Inc. and its subsidiaries.
      </div>
    </div>
  );
};

export default SparkFooter;
