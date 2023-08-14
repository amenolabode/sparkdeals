import React, { useState } from "react";
import { Header } from "./components/header";
import ProductCard from "./components/product_display";
import { productItems } from "./utils/dummy_product_data";
import { Modal, Input } from "antd";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";

const DealsPage = () => {
  const [openCheckOut, setOpenCheckOut] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [modalView, setModalView] = useState("cart");
  const [userName, setName] = useState("");
  const [userPhone, setPhone] = useState("");
  const [userEmail, setEmail] = useState("");
  const [userAddress, setAddress] = useState("");

  // const handleProductClick = (product) => {
  //   setSelectedProducts((prevSelectedProducts) => [
  //     ...prevSelectedProducts,
  //     { ...product, value: 1 },
  //   ]);
  //   setOpenCheckOut(true);
  // };
  const handleProductClick = (product) => {
    const productExists = selectedProducts.some(
      (selectedProduct) => selectedProduct.id === product.id
    );

    if (!productExists) {
      setSelectedProducts((prevSelectedProducts) => [
        ...prevSelectedProducts,
        { ...product, value: 1 },
      ]);
    }

    setOpenCheckOut(true);
  };
  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  const handleOk = () => {
    setOpenCheckOut(false);
    setModalView("cart");
  };

  const handleCancel = () => {
    setOpenCheckOut(false);
    setModalView("cart");
  };

  const addItem = (index) => {
    setSelectedProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      // updatedProducts[index].value += 1;

      updatedProducts[index].value += 1;

      return updatedProducts;
    });
  };

  const minusItem = (index) => {
    setSelectedProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      if (updatedProducts[index].value > 1) {
        updatedProducts[index].value -= 1;
      }
      return updatedProducts;
    });
  };

  const totalValue = selectedProducts.reduce(
    (total, product) => total + product.value * product.currentPrice,
    0
  );

  const handleChange = (e, index) => {
    const inputValue = e.target.value;
    setSelectedProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].value = inputValue;
      return updatedProducts;
    });
  };

  return (
    <div>
      <Header noInCart={selectedProducts.length} />
      <div className="m-[64px] grid grid-cols-3 gap-8 mt-24">
        {productItems.map((product, index) => (
          <ProductCard
            key={index}
            image={product.image}
            productName={product.productName}
            oldPrice={product.oldPrice}
            currentPrice={product.currentPrice}
            availaBleQTY={product.availaBleQTY}
            measurement={product.measurement}
            OnClick={() => {
              handleProductClick(product);
            }}
          />
        ))}
      </div>

      {openCheckOut && (
        <Modal
          open={openCheckOut}
          onOk={handleOk}
          onCancel={handleCancel}
          centered={true}
          footer={false}
          closable={true}
          title={
            <div className="text-[24px]">
              {modalView === "cart" && "Your Cart"}
              {modalView === "checkOut" && "Your Order"}
            </div>
          }
          width={480}
        >
          {modalView === "cart" && (
            <div>
              <div className="mt-4 pb-4 border-b">
                {selectedProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 rounded-lg mt-2 px-4 py-2"
                  >
                    <div className="w-full">
                      <div className="w-full text-[16px] font-medium ">
                        {product.productName}
                      </div>
                      <p className="text-[14px] text-gray-500">
                        GH₵ {product.currentPrice * product.value}
                      </p>
                    </div>
                    <div className="flex items-center mx-6 justify-evenly">
                      <FaMinusCircle
                        size={32}
                        onClick={() => minusItem(index)}
                        className="cursor-pointer"
                      />
                      <div className="w-full place-content-center">
                        <input
                          type="number"
                          value={product.value}
                          onChange={(e) => handleChange(e, index)}
                          placeholder="0"
                          className="bg-gray-100 w-full text-center rounded-md focus:outline-none focus:shadow-outline-blue placeholder-black text-[18px]"
                        />
                        {/* {product.measurement} */}
                      </div>
                      <FaPlusCircle
                        size={32}
                        onClick={() => addItem(index)}
                        className="cursor-pointer"
                      />
                    </div>
                    <p
                      className="cursor-pointer text-red-900 hover:text-red-500 text-[12px]"
                      onClick={() => {
                        handleRemoveProduct(product.id);
                      }}
                    >
                      remove
                    </p>
                  </div>
                ))}
              </div>
              <div
                className="cursor-pointer text-green mt-2 w-full text-center"
                onClick={handleOk}
              >
                Add More Items
              </div>
              <div
                className="text-[16px] w-full text-center cursor-pointer mt-8 capitalize bg-green hover:bg-[#0f5c2e] px-8 py-4 rounded-md text-white w-fit"
                onClick={() => {
                  selectedProducts.length !== 0
                    ? setModalView("checkOut")
                    : alert("Please add an item to continue");
                }}
              >
                {" "}
                Proceed to Checkout
              </div>
            </div>
          )}

          {modalView === "checkOut" && (
            <div className="mt-8">
              {selectedProducts.length > 0 && (
                <div>
                  {selectedProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex text-gray-600 justify-between items-center mb-4 border-b pb-4"
                    >
                      <p>{product.productName}</p>
                      <p>
                        {product.value} {product.measurement}
                      </p>
                      <p>GH₵ {product.currentPrice * product.value}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="font-medium flex justify-between items-center mb-4 border-b pb-4">
                <p>Total</p>

                <p>GH₵ {totalValue}</p>
              </div>

              <h2 className="mt-8 font-medium">Please Enter your Details</h2>
              <div className="mt-4">
                <div className="mb-1">
                  <label className="text-gray-500"> Name</label>
                </div>
                <Input
                  className="w-full h-[48px] hover:border-green-500 active:border-green-600"
                  placeholder="Please enter your name"
                  value={userName}
                  required={true}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <div className="mb-1">
                  <label className="text-gray-500"> Phone Number </label>
                </div>
                <Input
                  className="w-full h-[48px] hover:border-green-500 active:border-green-600"
                  placeholder="Please enter your phone number"
                  value={userPhone}
                  required={true}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <div className="mb-1">
                  <label className="text-gray-500"> Email Address </label>
                </div>
                <Input
                  className="w-full h-[48px] hover:border-green-500 active:border-green-600"
                  placeholder="Please enter your email"
                  value={userEmail}
                  required={true}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mt-4">
                <div className="mb-1">
                  <label className="text-gray-500"> House Address </label>
                </div>
                <Input
                  className="w-full h-[48px] hover:border-green-500 active:border-green-600"
                  placeholder="Please enter your address"
                  value={userAddress}
                  required={true}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div
                className="text-[16px] w-full text-center cursor-pointer mt-8 capitalize bg-green hover:bg-[#0f5c2e] px-8 py-4 rounded-md text-white w-fit"
                onClick={() => {}}
              >
                {" "}
                Checkout
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default DealsPage;
