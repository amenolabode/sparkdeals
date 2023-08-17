import React, { useState, useEffect, useRef } from "react";
import { Header } from "./components/header";
import ProductCard from "./components/product_display";
import { Modal, Input, Drawer } from "antd";
import { FaCheckCircle, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./utils/init_firebase";
import emailjs from "@emailjs/browser";
import Lottie from "lottie-react";
import animationData from "./assets/animation_lldyxh5j.json";
import animationData2 from "./assets/animation_lle1e0mt.json";
import SparkFooter from "./components/footer";

const DealsPage = () => {
  const [openCheckOut, setOpenCheckOut] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [modalView, setModalView] = useState("cart");
  const [userName, setName] = useState("");
  const [userPhone, setPhone] = useState("");
  const [userEmail, setEmail] = useState("");
  const [userAddress, setAddress] = useState("");
  const [allDocs, setAllDocs] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [useDrawer, setUseDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const paid = false;
  const delivered = false;

  const isCheckOutValid =
    userAddress !== "" &&
    userName !== "" &&
    userPhone !== "" &&
    selectedProducts.length !== 0;

  const handleOpenCart = () => {
    setOpenCheckOut(true);
  };

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
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    setOpenCheckOut(true);
  };

  const submitEmailHandler = () => {
    const emailData = {
      user_name: userName,
      user_email: userEmail,
      message: generateEmailMessage(),
    };

    emailjs
      .send(
        "service_vtcz456",
        "template_zco880e",
        emailData,
        "tmnsvtTFyEkOyaF5Q"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  const generateEmailMessage = () => {
    let message = "Order Details:\n";
    selectedProducts.forEach((product) => {
      message += `
          ${product.productName} - ${product.value} ${product.measurement}
        
      `;
    });

    message += `\nTotal: GH₵ ${totalValue}\n
    
    `;

    message += `\nBuyer Details\n`;
    message += `\nName ${userName}\n`;
    message += `\nEmail: ${userEmail}\n`;
    message += `\nPhone: ${userPhone}\n`;
    message += `\nDelivery Address: ${userAddress}\n`;

    return message;
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

  const totalValue = selectedProducts.reduce(
    (total, product) => total + product.value * product.currentPrice,
    0
  );

  const handleProcessOrder = async () => {
    try {
      setLoading(true);

      const collectionRef = collection(db, "orders");

      const newOrder = {
        totalValue,
        selectedProducts,
        userName,
        userEmail,
        userPhone,
        userAddress,
        paid,
        delivered,
      };

      await addDoc(collectionRef, newOrder);

      setSelectedProducts([]);
      setAddress("");
      setEmail("");
      setName("");
      setPhone("");
      setOpenCheckOut(false);
      setSuccess(true);
      setLoading(false);
      setModalView("cart");

      submitEmailHandler(newOrder);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      setLoading(false);
    }
  };

  const handleChange = (e, index) => {
    const inputValue = e.target.value;
    setSelectedProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index].value = inputValue;
      return updatedProducts;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const dealsRef = collection(db, "deals");
      const querySnapshot = await getDocs(dealsRef);

      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      setAllDocs(documents);
    };

    fetchData();
  }, []);

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
              className="flex items-center mt-3 bg-gray-100 rounded-lg px-4 py-2"
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
                  onClick={() => addItem(index, product.availableQTY)}
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
          {selectedProducts.length === 0
            ? "Add an item to cart"
            : "Add More Items"}
        </div>
        <div
          className={`${
            selectedProducts.length === 0 && "hidden"
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
      <div classNFme="">
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

        <div
          className={`${
            isCheckOutValid
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

  return (
    <div className="">
      <Header
        noInCart={selectedProducts.length}
        handleOpenCart={handleOpenCart}
      />
      <div className="mx-[16px] md:mx-[64px] bg-white flex justify-between mt-4 md:mt-32 py-4 items-center px-[16px] md:px-[32px] rounded-lg">
        <h2 className="text-[18px] md:text-[32px] font-semibold text-gray-700">
          Spark Weekly Deals
        </h2>
      </div>
      {allDocs.length === 0 && (
        <div className="flex px-6 py-2 mb-8 space-x-4 animate-pulse mt-24">
          <div className="flex-1 py-1 space-y-6">
            <div className="h-2 rounded bg-slate-200"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 col-span-2 rounded bg-slate-200"></div>
                <div className="h-2 col-span-1 rounded bg-slate-200"></div>
                <div className="h-2 col-span-1 rounded bg-slate-200"></div>
                <div className="h-2 col-span-1 rounded bg-slate-200"></div>
                <div className="h-2 col-span-1 rounded bg-slate-200"></div>
                <div className="h-2 col-span-1 rounded bg-slate-200"></div>
                <div className="h-2 col-span-1 rounded bg-slate-200"></div>
                <div className="h-2 col-span-1 rounded bg-slate-200"></div>
                <div className="h-2 col-span-1 rounded bg-slate-200"></div>
              </div>
              <div className="h-2 rounded bg-slate-200"></div>
            </div>
          </div>
        </div>
      )}
      <div className="mx-[16px] b-[16px] md:m-[64px] grid grid-cols-2 md:grid-cols-3 gap-[16px] md:gap-8 mt-[16px] md:mt-4">
        {allDocs.map((product, index) => (
          <ProductCard
            key={index}
            // image="./Manifest.jpg"
            image={product.imageURL}
            productName={product.productName}
            oldPrice={product.oldPrice}
            currentPrice={product.currentPrice}
            availaBleQTY={product.availableQTY}
            measurement={product.measurement}
            endDate={product.expiryDate}
            classExtra={"mb-2 md:mb-8"}
            OnClick={() => {
              handleProductClick(product);
            }}
          />
        ))}
      </div>

      {useDrawer && openCheckOut && (
        <Drawer
          placement="bottom"
          closable={false}
          onClose={handleCancel}
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
          {modalView === "cart" && displayCart()}
          {modalView === "checkOut" && displayCheckout()}
        </Modal>
      )}

      {success && (
        <Modal
          open={success}
          onOk={handleOk}
          onCancel={handleCancel}
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
