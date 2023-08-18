import React from "react";
import CountdownTimer from "./countdown_time";

const ProductCard = ({
  image,
  productName,
  OnClick,
  oldPrice,
  currentPrice,
  availaBleQTY,
  measurement,
  classExtra,
  endDate,
}) => {
  const discount = Math.floor(100 - (currentPrice / oldPrice) * 100);

  return (
    <div
      className={`bg-white min-w-130 h-[500px] md:h-auto p-[8px] rounded-lg ${classExtra}`}
    >
      <div className="h-[35%] md:h-[400px] mx-auto mb-4 flex items-center justify-center overflow-hidden rounded-md">
        <img src={image} alt="" className="h-full w-full object-cover " />
      </div>
      <div className="p-[4px] mt-4 md:mt-0 md:p-[16px]">
        <div className="md:flex justify-between items-center">
          <div className="md:hidden mb-2 w-fit text-[12px] text-[#327531] border border-[#A4FF8D] bg-[#CAFFC1] px-4 py-[1px] rounded-sm">
            {discount}% off
          </div>
          <div className="text-gray-600 text-[14px] md:text-[16px]">
            {productName}
          </div>
          <div className="hidden md:block w-fit text-[14px] text-[#327531] border border-[#A4FF8D] bg-[#CAFFC1] px-4 py-[1px] rounded-sm">
            {discount}% off
          </div>
        </div>
        <div className="flex items-center">
          {" "}
          <div
            className="text-[15px] mr-1 text-gray-500"
            style={{ textDecoration: "line-through" }}
          >
            GH₵ {oldPrice}
          </div>
          <div className="text-gray-800 text-[18px] md:text-[24px] font-medium">
            GH₵ {currentPrice}
          </div>
        </div>
        <div className="text-[14px] md:text-[16px] text-gray-600 font-base">
          {availaBleQTY} {measurement} Available
        </div>
        <div
          className="cursor-pointer mt-4 md:mt-8 capitalize bg-green hover:bg-[#0f5c2e] px-4 md:px-8 py-3 md:py-4 rounded-md text-white w-full text-center md:w-fit"
          onClick={OnClick}
        >
          {" "}
          Get this deal
        </div>

        <div className="text-gray-600 text-[16px] mt-4">
          {" "}
          <div>Deal Expires in{" "}</div>
          <CountdownTimer className="text-red-700 font-medium " endDate={endDate} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
