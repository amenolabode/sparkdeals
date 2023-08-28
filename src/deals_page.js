import React, { useState, useEffect } from "react";
import { Header } from "./components/header";
import ProductCard from "./components/User/product_display";
import { Modal, Input, Drawer } from "antd";
import { FaCheck, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import Lottie from "lottie-react";
import animationData from "./assets/animation_lldyxh5j.json";
import animationData2 from "./assets/animation_lle1e0mt.json";
import SparkFooter from "./components/footer";
import { setCookie } from "./utils/local_storage";
import { handleProcessingOrder, useFetchData } from "./utils/firebase_config";
import { sendEmail } from "./utils/send_email";
import { environment } from "./utils/environment";
import LoadingAnimation from "./components/loading_animation";

const DealsPage = () => {
  const [openCheckOut, setOpenCheckOut] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [modalView, setModalView] = useState("cart");
  const [userName, setName] = useState("");
  const [userPhone, setPhone] = useState("");
  const [userEmail, setEmail] = useState("");
  const [userAddress, setAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [useDrawer, setUseDrawer] = useState(false);
  const [less360, setLess360] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [couponVisible, setCouponVisible] = useState(false);
  const [couponValid, setCouponValid] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const paid = false;
  const delivered = false;

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

    const updatedCart = [
      ...selectedProducts,
      { ...product, value: product.value || 1 },
    ];

    // Save cart data to localStorage
    setCookie("cart", updatedCart);
    setOpenCheckOut(true);
  };

  const submitEmailHandler = async () => {
    try {
      await sendEmail(
        userName,
        userEmail,
        selectedProducts,
        totalValue,
        userPhone,
        userAddress
      );

    } catch (error) {

    }
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );

    const updatedCart = selectedProducts.filter(
      (product) => product.id !== productId
    );

    // Save updated cart data to localStorage
    setCookie("cart", updatedCart);
  };


  const handleOkAndCancel = () => {
    setOpenCheckOut(false);
    setModalView("cart");
  };

  const handle = () => {
    setOpenCheckOut(false);
    setModalView("cart");
  };

  const handleChange = (e, index) => {
    const inputValue = e.target.value;
    setSelectedProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].value = inputValue;
      return updatedProducts;
    });
  };

  const addItem = (index, quantity) => {
    setSelectedProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      const product = updatedProducts[index];

      if (product.value < quantity) {
        product.value += 1;
      }

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

  const discountCalc = discountPercent / 100
  const totalValue = selectedProducts.reduce(
    (total, product) => (total + product.value * product.currentPrice),
    0
  );
  const discountValue = totalValue * discountCalc
  const discountedValue = totalValue - discountValue


  const handleProcessOrder = async () => {
    const newOrder = {
      discountedValue,
      selectedProducts,
      userName,
      userEmail,
      userPhone,
      userAddress,
      paid,
      delivered,
      couponCode
    };
    setLoading(true);
    const isSuccess = await handleProcessingOrder(newOrder);
    if (isSuccess) {
      setSelectedProducts([]);
      setAddress("");
      setEmail("");
      setName("");
      setPhone("");
      setOpenCheckOut(false);
      setSuccess(true);
      setLoading(false);
      setModalView("");
      if (environment === "production") {
        submitEmailHandler(newOrder);
      }
      clearCart();
    }
  };

  const allDocs = useFetchData(modalView, "deals");
  const allCouponCodes = useFetchData(couponVisible, "coupons");

  useEffect(() => {
    const validCoupon = () => {
      const matchingCoupon = allCouponCodes.find(
        (coupon) => coupon.couponCode === couponCode
      );

      if (matchingCoupon) {

        setCouponValid(true);
        // console.log(matchingCoupon.id)
        // console.log(matchingCoupon.holderName)
        // console.log(matchingCoupon.discountPercent)
        setDiscountPercent(matchingCoupon.discountPercent)
      } else {
        setCouponValid(false);
      }
    };

    if (couponCode) {
      validCoupon();
    }
  }, [couponCode, allCouponCodes]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setSelectedProducts(JSON.parse(savedCart));
    }
  }, []);

  const clearCart = () => {
    setSelectedProducts([]);
    localStorage.removeItem("cart");
  };

  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }

    if (screenWidth < 640) {
      setUseDrawer(true);
    } else {
      setUseDrawer(false);
    }
    if (screenWidth < 300) {
      setLess360(true);
    } else {
      setLess360(false);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [screenWidth]);

  const displayCart = () => {
    return (
      <div>
        {selectedProducts.length === 0 && (
          <div className="text-center">
            {" "}
            <div className="my-4">Oops, Your Cart is empty </div>
            <Lottie className="h-48" animationData={animationData} />
          </div>
        )}
        <div className="pb-4 border-b">
          {selectedProducts.map((product, index) => (
            <div
              key={index}
              className="relative flex items-center mt-3 bg-gray-100 rounded-lg px-4 py-2"
            >
              <FaPlusCircle
                className="lg:hidden rotate-45 text-red-900 absolute top-0 right-0 -mt-2 -mr-2 cursor-pointer"
                size={18}
                onClick={() => {
                  handleRemoveProduct(product.id);
                }}
              />
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
                  onClick={() => addItem(index, product.availableQTY)}
                  className="cursor-pointer"
                />
              </div>
              <p
                className="hidden lg:block cursor-pointer text-red-900 hover:text-red-500 text-[12px]"
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
          onClick={handleOkAndCancel}
        >
          {selectedProducts.length === 0
            ? "Add an item to cart"
            : "Add More Items"}
        </div>
        <div
          className={`${selectedProducts.length === 0 && "hidden"
            } text-[16px] w-full text-center cursor-pointer mt-8 capitalize bg-green hover:bg-[#0f5c2e] text-whitepx-8 py-4 rounded-md text-white`}
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
    );
  };

  const displayCheckout = () => {
    return (
      <div className="h-[78vh] overflow-y-scroll no-scrollbar">
        {selectedProducts.length > 0 && (
          <div className="">
            {selectedProducts.map((product, index) => (
              <div
                key={index}
                className="flex text-gray-600 justify-between items-center  border-b-2 py-4"
              >
                <p className="w-1/3 ">{product.productName}</p>
                <p>
                  {product.value} {product.measurement}
                </p>
                <p>GH₵ {(product.currentPrice * product.value)} </p>
              </div>
            ))}
          </div>
        )}
        {couponVisible && <div><div className="border-b-2 mt-1 mb-2"></div>
          <div className="font-medium flex justify-between items-center mb-4 border-b pb-4">
            <p>Sub Total</p>

            <p>GH₵ {totalValue}</p>
          </div>
          <div className="font-medium flex justify-between items-center mb-4 border-b pb-4">
            <p>Discount</p>
            <div className="flex items-center gap-4">{couponValid && <div className="text-[#327531] border border-[#A4FF8D] bg-[#CAFFC1] px-4 py-1 rounded-md flex items-center gap-4"> {discountPercent}% Coupon Applied</div>}
              <p>GH₵ {discountValue}</p></div>
          </div></div>}
        <div className={`${!couponVisible && "mt-4"} font-medium flex justify-between items-center mb-4 border-b pb-4`}>
          <p>Total</p>
          <p>GH₵ {discountedValue}</p>
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
            <label className="text-gray-500"> Delivery Address </label>
          </div>
          <Input
            className="w-full h-[48px] hover:border-green-500 active:border-green-600"
            placeholder="Please enter your address"
            value={userAddress}
            required={true}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {!couponVisible && (
          <div
            className="text-green mt-4 cursor-pointer"
            onClick={() => {
              setCouponVisible(true);

            }}
          >
            I have a discount code
          </div>
        )}
        {couponVisible && (
          <div className="mt-4">
            <div className="mb-1">
              <label className="text-gray-500"> Coupon Code </label>

            </div>
            <div className="relative flex">
              <Input
                className="w-full h-[48px] hover:border-green-500 active:border-green-600"
                placeholder="Enter Coupon Code"
                value={couponCode}
                required={true}
                onChange={(e) => { setCouponCode(e.target.value) }}
              />
              {couponValid && <div className="absolute right-2 top-2 text-[#327531] border border-[#A4FF8D] bg-[#CAFFC1] px-4 py-1 rounded-md flex items-center gap-4"><FaCheck className="text-green" /> </div>}
            </div>
          </div>
        )}

        <div
          className={`${isCheckOutValid
            ? "bg-green hover:bg-[#0f5c2e] text-white"
            : "bg-gray-200 text-gray-500"
            } text-[16px] w-full text-center cursor-pointer mt-8 capitalize px-8 py-4 rounded-md`}
          onClick={() => {
            isCheckOutValid && handleProcessOrder();
          }}
        >
          {" "}
          {loading ? "Sending Order..." : "Checkout"}
        </div>
      </div>
    );
  };

  // Validation
  const isCheckOutValid =
    userAddress !== "" &&
    userName !== "" &&
    userPhone !== "" &&
    selectedProducts.length !== 0;

  return (
    <div className="">
      <Header
        noInCart={selectedProducts.length}
        handleOpenCart={() => setOpenCheckOut(true)}
      />
      <div className="min-h-[70vh]">
        <div className="hidden md:block mx-[16px] md:mx-[64px]  justify-between mt-24 md:mt-[120px] items-center px-[16px] md:px-[0px] rounded-lg">
          <h2 className="text-[18px] md:text-[20px] font-semibold text-gray-700">
            Weekly Deals
          </h2>
        </div>
        {allDocs.length === 0 && (
          <LoadingAnimation />
        )}
        <div className={`mt-28 mx-[16px] b-[16px] md:m-[64px] grid ${less360 ? " grid-cols-1" : " grid-cols-2"} md:grid-cols-3 gap-[16px] md:gap-8 md:mt-4`}>
          {allDocs.map((product, index) => (
            <ProductCard
              key={index}
              image={product.imageURL}
              productName={product.productName}
              oldPrice={product.oldPrice}
              currentPrice={product.currentPrice}
              availaBleQTY={product.availableQTY}
              measurement={product.measurement}
              endDate={product.expiryDate}
              classExtra={"mb-2 md:mb-2"}
              OnClick={() => {
                handleProductClick(product);
              }}
            />
          ))}
        </div>
      </div>


      {useDrawer && openCheckOut && (
        <Drawer
          placement="bottom"
          closable={false}
          onClose={handle}
          key="bottom"
          className="rounded-t-xl"
          height="90%"
          open={openCheckOut}
          title={
            <div className="text-[24px]">
              {modalView === "cart" && "Your Cart"}
              {modalView === "checkOut" && "Your Order"}
            </div>
          }
        >
          {modalView === "cart" && displayCart()}
          {modalView === "checkOut" && displayCheckout()}
        </Drawer>
      )}

      {!useDrawer && openCheckOut && (
        <Modal
          open={openCheckOut}
          onOk={handleOkAndCancel}
          onCancel={handle}
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
          {modalView === "cart" && displayCart()}
          {modalView === "checkOut" && displayCheckout()}
        </Modal>
      )}

      {success && (
        <Modal
          open={success}
          onOk={handleOkAndCancel}
          onCancel={handle}
          centered={true}
          footer={false}
          closable={true}
          width={360}
        >
          <div className="items-center flex flex-col">
            <div className="w-full justify-center text-center place-items-center">
              <Lottie className="h-32" animationData={animationData2} />
              <div className="flex flex-col text-center">
                <div className="text-center mt-4 text-[24px] font-medium boder-b leading-tight">
                  Order Placed Successfully
                </div>
                <p className="text-[14px] w-[75%] mt-2 m-auto text-gray-600 text-center">
                  Our team will reach out to you in order to finalize your order
                </p>
              </div>
            </div>

            <div
              onClick={() => {
                setSuccess(false);
              }}
              className="mt-8 mb-4 text-green cursor-pointer"
            >
              Close
            </div>
          </div>
        </Modal>
      )}
      <SparkFooter />
    </div>
  );
};

export default DealsPage;
