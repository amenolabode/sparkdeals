import React from "react";
import { DatePicker, Input } from "antd";

export const AddDealForm = ({
  productName,
  setProductName,
  oldPrice,
  setOldPrice,
  newPrice,
  setNewPrice,
  quantity,
  setQuantity,
  unit,
  setUnit,
  setStartDate,
  setExpiryDate,
  isAdditionValid,
  handleAddDeal,
  setImage,
  loading,
  resetFormVariables
}) => {
  return (
    <div className="mx-auto">
      <div className="mt-4">
        <div className="mb-1">
          <label className="text-gray-500">Product Image</label>
        </div>
        <Input
          type="file"
          name="image"
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        ></Input>
      </div>

      <div className="mt-4">
        <div className="mb-1">
          <label className="text-gray-500"> Product Name</label>
        </div>
        <Input
          className="w-full h-[48px] hover:border-green-500 active:border-green-600"
          placeholder="Please enter Product Name"
          value={productName}
          required={true}
          onChange={(e) => setProductName(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <div className="mb-1">
          <label className="text-gray-500"> Old (Market) Price </label>
        </div>
        <Input
          className="w-full h-[48px] hover:border-green-500 active:border-green-600"
          placeholder="Old Price"
          value={oldPrice}
          required={true}
          onChange={(e) => setOldPrice(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <div className="mb-1">
          <label className="text-gray-500"> New (Spark) Price </label>
        </div>
        <Input
          className="w-full h-[48px] hover:border-green-500 active:border-green-600"
          placeholder="New Price"
          value={newPrice}
          required={true}
          onChange={(e) => setNewPrice(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <div className="mb-1">
          <label className="text-gray-500"> Available Quantity </label>
        </div>
        <Input
          className="w-full h-[48px] hover:border-green-500 active:border-green-600"
          placeholder="Available Quantity"
          value={quantity}
          required={true}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <div className="mb-1">
          <label className="text-gray-500"> Unit (Kg, Pieces, Packs) </label>
        </div>
        <select
          className="w-full px-2 rounded-md h-[48px] border hover:border-green-500 active:border-green-600"
          value={unit}
          required={true}
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="">Select Unit</option>
          <option value="Kg(s)">Kg</option>
          <option value="Bag(s)">Bag</option>
          <option value="Pieces">Piece</option>
          <option value="Gallon(s)">Gallon</option>
          <option value="Pack(s)">Pack</option>
          <option value="Box(es)">Box</option>
        </select>
      </div>

      <div className="mt-4">
        <div className="mb-1">
          <label className="text-gray-500"> Deal Start Date</label>
        </div>
        <DatePicker
          className="w-full h-[48px]"
          onChange={(date, dateString) => setStartDate(dateString)}
        />
      </div>
      <div className="mt-4">
        <div className="mb-1">
          <label className="text-gray-500"> Deal Expiry Date</label>
        </div>
        <DatePicker
          className="w-full h-[48px]"
          onChange={(date, dateString) => setExpiryDate(dateString)}
        />
      </div>

      <div
        className={`${
          isAdditionValid
            ? "bg-green hover:bg-[#0f5c2e] text-white"
            : "bg-gray-200 text-gray-500"
        } text-[16px] w-full mt-8 text-center cursor-pointer capitalize  px-8 py-4 rounded-md w-fit`}
        onClick={isAdditionValid ? handleAddDeal : undefined}
      >
        {" "}
        {loading ? "Adding Deal..." : "Add Deal"}
      </div>
    </div>
  );
};
