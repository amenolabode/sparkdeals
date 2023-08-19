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
      className={`bg-white min-w-130 h-[480px] md:h-[580px] lg:h-auto p-[8px] rounded-lg ${classExtra}`}
    >
      <div className="h-[35%] md:h-[50%] lg:h-[400px] mx-auto mb-4 flex items-center justify-center overflow-hidden rounded-md">
        <img src={image} alt="" className="h-full w-full object-cover " />
      </div>
      <div className="p-[4px] mt-4 lg:mt-0 lg:p-[16px]">
        <div className="lg:flex justify-between items-center">
          <div className="lg:hidden mb-2 w-fit text-[12px] text-[#327531] border border-[#A4FF8D] bg-[#CAFFC1] px-4 py-[1px] rounded-sm">
            {discount}% off
          </div>
          <div className="text-gray-600 text-[14px] lg:text-[16px]">
            {productName}
          </div>
          <div className="hidden lg:block w-fit text-[14px] text-[#327531] border border-[#A4FF8D] bg-[#CAFFC1] px-4 py-[1px] rounded-sm">
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
          <div className="text-gray-800 text-[18px] lg:text-[24px] font-medium">
            GH₵ {currentPrice}
          </div>
        </div>
        <div className="text-[14px] lg:text-[16px] text-gray-600 font-base">
          {availaBleQTY} {measurement} Available
        </div>
        <div
          className="cursor-pointer mt-4 lg:mt-8 capitalize bg-green hover:bg-[#0f5c2e] px-4 lg:px-8 py-3 lg:py-4 rounded-md text-white w-full text-center lg:w-fit"
          onClick={OnClick}
        >
          {" "}
          Get this deal
        </div>

        <div className="text-gray-600 text-[16px] mt-4">
          {" "}
          <div>Deal Expires in </div>
          {endDate === "0 days 0 hours 0 minutes 0 seconds" && (
            <div className="mt-2 text-red-900 font-semibold bg-red-100 border-red-200 border px-4 py-1 rounded-md w-fit">
              Expired
            </div>
          )}
          {endDate !== "0 days 0 hours 0 minutes 0 seconds" && (
            <CountdownTimer
            className="text-red-700 font-medium "
            endDate={endDate}
          />
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
