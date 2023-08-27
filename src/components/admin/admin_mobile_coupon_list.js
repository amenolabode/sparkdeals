import React from 'react';
import { FaEllipsisV } from 'react-icons/fa';

const ProductList = ({
  useDrawer,
  allDocs,
  menuVisible,
  menuToggle,
  handleSetMenuToggle,
  handleOpenModal,
}) => {
    const formatDate = (inputDate) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = new Date(inputDate).toLocaleDateString(
          undefined,
          options
        );
        return formattedDate;
      };
    
  return (
    <div className={`${!useDrawer && "hidden"} mt-4`}>
      {allDocs.map((product) => (
        <div
          key={product.id}
          className="mx-[16px] flex items-center mt-3 bg-white rounded-lg px-4 py-4"
        >
          <div className="w-full">
            <div className="flex items-center text-gray-700">
              <div className="w-full truncate text-[20px] font-medium mb-1">
                {product.productName}
              </div>
              <div
                className="flex place-content-end"
                onClick={() => {
                  handleSetMenuToggle(product.id);
                }}
              >
                <FaEllipsisV className="text-gray-700" />
              </div>
              {menuToggle === product.id ? (
                menuVisible && (
                  <ul className="absolute right-12 z-10 py-2 mt-2 bg-white border rounded-md shadow-md">
                    <li
                      onClick={() => {
                        handleOpenModal(product);
                      }}
                      className="px-4 py-2 font-medium text-gray-700 border-b hover:bg-gray-100"
                    >
                      Delete
                    </li>
                  </ul>
                )
              ) : (
                ""
              )}
            </div>
            <div className="flex items-center mt-4">
              <p className="text-[16px] text-gray-500 mr-2">
                GH₵ {product.currentPrice}
              </p>
              <div className=" w-fit text-[14px] text-[#327531] border border-[#A4FF8D] bg-[#CAFFC1] px-[8px] py-[2px] rounded-sm">
                {product.discount}% off
              </div>
            </div>
            <p className="text-[16px] text-gray-500 mt-1">
              {product.availableQTY} {product.measurement} Available
            </p>

            <div className="flex mt-6 gap-[12px] w-full">
              <div className="w-full bg-gray-50 border rounded-md p-2">
                <p className="text-[13px] text-gray-400">Deal Starts</p>
                <p className="text-[16px] text-gray-700 mt-1">
                  {formatDate(product.startDate)}
                </p>
              </div>
              <div className="w-full bg-gray-50 border rounded-md p-2">
                <p className="text-[13px] text-gray-400">Deal Expires</p>
                <p className="text-[16px] text-gray-700 mt-1">
                  {formatDate(product.expiryDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
