import React, { useState, useEffect } from "react";
import { Header } from "./components/header";
import {
  createCouponHandler,
  handleDeleteDoc,
  handleDeliveryUpdate,
  handlePaymentUpdate,
  handleSubmit,
  useFetchData,
} from "./utils/firebase_config";
import { Modal, Drawer } from "antd";
import {
  FaChevronCircleUp,
  FaEllipsisV,
  FaExclamationCircle,
  FaPlus,
} from "react-icons/fa";
import SparkFooter from "./components/footer";
import { setCookie } from "./utils/local_storage";
import { AddDealForm } from "./components/admin/admin_add_deal_form";
import { AdminAddCoupon } from "./components/admin/admin_add_coupon";
import ProductList from "./components/admin/admin_mobile_coupon_list";
// import { AuthDetails } from "./utils/firebase_config";

const AdminPage = () => {
  const [productName, setProductName] = useState("");
  const [holderName, setHoldername] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [discountPercent, setDiscountPercent] = useState("")
  const [oldPrice, setOldPrice] = useState(0);
  const [newPrice, setNewPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("");
  const [image, setImage] = useState(null);
  const [openModal, setOpenModal] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [useDrawer, setUseDrawer] = useState(false);
  const [activePage, setActivePage] = useState("deals");
  const [expiryDate, setExpiryDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuToggle, setMenuToggle] = useState("");
  const [modalVisible, setModalVisible] = useState("");
  const [modalData, setModalData] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const discount = Math.floor(100 - (newPrice / oldPrice) * 100);


  const handleSetMenuToggle = (value) => {
    if (menuToggle === value) {
      setMenuVisible(!menuVisible);
    } else {
      setMenuToggle(value);
    }
  };
  const handleOpenModal = (modalName, data) => {
    setOpenModal(modalName);
    setModalVisible(true);
    setModalData(data);
  };

  const handleOkAndCancel = () => {
    setOpenModal("");
    setLoading(false);
    setMenuToggle("");
    setMenuVisible(false);
    setModalVisible(false);
  };

  const handleCloseModals = () => {
    setOpenModal("");
    setLoading(false);
    setMenuToggle("");
    setMenuVisible(false);
    setModalVisible(false);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    setCookie("page", page);
  };

  const onCouponCodeGenerated = (couponCode) => {
    setCouponCode(couponCode)
  }

  // Firebase  GET Functions
  const orderDocs = useFetchData(loading, "orders");
  const allDocs = useFetchData(loading, "deals");
  const couponDocs = useFetchData(loading, "coupons");

  // Firebase POST Functions Start
  const handleConfirmDelete = async () => {
    const isSuccess = await handleDeleteDoc(modalData.id);
    if (isSuccess) {
      handleCloseModals();
    } else {
    }
  };

  const resetFormVariables = () => {
    setProductName("");
    setOldPrice("");
    setNewPrice("");
    setQuantity("");
    setUnit("");
    setStartDate("");
    setExpiryDate("");
    setImage(null);
  };

  const resetCouponVariable = () => {
    setCouponCode("")
    setDiscountPercent("")
  }

  const handleAddDeal = async () => {
    const deliveredAt = "";
    const paidAt = "";
    setLoading(true);
    const isSuccess = await handleSubmit(
      productName,
      oldPrice,
      expiryDate,
      startDate,
      newPrice,
      quantity,
      unit,
      discount,
      image,
      deliveredAt,
      paidAt
    );
    if (isSuccess) {
      resetFormVariables();
      handleCloseModals();
      alert("Deal Added Successfully");
    }
  };

  const upDatePaymentStatus = async (orderId) => {
    setLoading(true);
    const isSuccess = await handlePaymentUpdate(orderId);

    if (isSuccess) {
      handleCloseModals();
      alert("Payment Updated");
    }
  };

  const updateDeliveryUpdate = async (orderId) => {
    setLoading(true);
    const isSuccess = await handleDeliveryUpdate(orderId);
    if (isSuccess) {
      handleCloseModals();
      alert("Order Delivered");
    }
  };

  const handleCreateCoupon = async () => {

    const couponUsage = []
    setLoading(true);
    const isSuccess = await createCouponHandler(
      holderName,
      discountPercent,
      couponCode,
      couponUsage
    );
    if (isSuccess) {
      resetCouponVariable();
      handleCloseModals();
      alert("Deal Added Successfully");
    }
  }
  // Firebase POST Functions End

  useEffect(() => {
    const savedPage = localStorage.getItem("page");
    if (savedPage) {
      setActivePage(JSON.parse(savedPage));
    }
  }, []);

  // Check Window Size and Resize
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


  // Validation
  const isFormValid = true;

  const isAdditionValid =
    productName !== "" &&
    oldPrice !== 0 &&
    newPrice !== 0 &&
    quantity !== 0 &&
    unit !== "" &&
    image !== null &&
    expiryDate !== "" &&
    startDate !== "";

  return (
    <div>
      <Header />
      {/* Page */}
      {/* top */}

      {/* Mobile Add Deal Button */}
      <div className="min-h-[70vh]"><div
        className={`${!useDrawer && "hidden"
          } fixed bottom-8 right-8 z-10 text-[16px] text-center cursor-pointer capitalize bg-green hover:bg-[#0f5c2e] px-8 py-8 rounded-[80px] text-white w-fit`}
        onClick={() => {
          if (activePage === "deals") {
            setModalVisible(true);
            setOpenModal("addDeal");
          }
          if (activePage === "coupon") {
            setModalVisible(true);
            setOpenModal("coupon");
          }

        }}
      >
        <FaPlus size={18} />
      </div>
        {/* Deals and Orders Tab Group */}
        <div className="mt-24 md:mt-32 h-16 flex justify-between items-center px-[16px] md:px-[64px] w-full">
          {" "}
          <div className="flex">
            <div
              className={`cursor-pointer ${activePage === "deals" && "bg-green text-white rounded-md"
                } px-4 md:px-8 py-2 text-gray-600`}
              onClick={() => {
                handlePageChange("deals");
              }}
            >
              Deals
            </div>
            <div
              className={`cursor-pointer ${activePage === "orders" && "bg-green text-white rounded-md"
                } px-4 md:px-8 py-2 text-gray-600`}
              onClick={() => {
                handlePageChange("orders");
              }}
            >
              Orders
            </div>
            <div
              className={`cursor-pointer ${activePage === "coupon" && "bg-green text-white rounded-md"
                } px-4 md:px-8 py-2 text-gray-600`}
              onClick={() => {
                handlePageChange("coupon");
              }}
            >
              Coupons
            </div>
          </div>
          <div className="flex items-center gap-8"><div
            onClick={() => handleOpenModal("history", allDocs)}
            className="cursor-pointer text-green"
          >
            {activePage === "orders" && "view history"}
          </div>
            <div
              className={`${useDrawer && "hidden"
                } ${activePage === "orders" && "hidden"} text-[16px] w-content text-center cursor-pointer capitalize bg-green hover:bg-[#0f5c2e] px-8 py-4 rounded-md text-white w-fit`}
              onClick={() => {
                if (activePage === "deals") {
                  setModalVisible(true);
                  setOpenModal("addDeal");
                }
                if (activePage === "coupon") {
                  setModalVisible(true);
                  setOpenModal("coupon");
                }

              }}
            >
              {" "}
              {activePage === "coupon" ? "Create coupon" : "Add new Deal"}
            </div></div>

        </div>
        {/* Active Page Display */}
        {/* Deals Display */}
        {activePage === "deals" && (
          <>
            {/* Desktop Deals View Table */}

            <div
              className={`${useDrawer && "hidden"} px-[16px] md:px-[64px] mt-4`}
            >
              <table className="w-full text-base font-normal text-left text-white table-auto">
                <thead className="bg-black ">
                  <tr>
                    <th
                      scope="col"
                      className="px-2 py-4 pl-4 font-normal rounded-l-md"
                    >
                      Product Name
                    </th>

                    <th scope="col" className="py-4 font-normal ">
                      Old Price
                    </th>
                    <th scope="col" className="py-4 font-normal ">
                      Current Price
                    </th>
                    <th scope="col" className="px-4 py-4 font-normal text-center">
                      Qty Available
                    </th>
                    <th scope="col" className="px-2 py-4 font-normal text-center">
                      Measurement
                    </th>

                    <th
                      scope="col"
                      className="px-2 py-4 font-normal rounded-r-md"
                    ></th>
                  </tr>
                </thead>

                {/* //TABLE ROWS */}
                <tbody>
                  {allDocs.map((product) => (
                    <tr
                      className="bg-white border-b cursor-pointer border-slate-100 hover:bg-gray-50"
                      key={product.id}
                    >
                      <td onClick={() => { }} className="py-6 pl-4 text-gray-700">
                        {product.productName}
                      </td>
                      <td onClick={() => { }} className="py-4 text-gray-700">
                        {product.oldPrice}
                      </td>
                      <td onClick={() => { }} className="py-6 pl-4 text-gray-700">
                        {product.currentPrice}
                      </td>
                      <td
                        onClick={() => { }}
                        className="text-center text-gray-700"
                      >
                        {product.availableQTY}
                      </td>
                      <td
                        onClick={() => { }}
                        className="px-4 py-4 text-center text-gray-700"
                      >
                        {product.measurement}
                      </td>
                      <td
                        className="px-4 py-4 text-gray-700"
                        onClick={() => {
                          handleSetMenuToggle(product.id);
                        }}
                      >
                        <FaEllipsisV />
                        {menuToggle === product.id
                          ? menuVisible && (
                            <ul className="absolute right-12 z-10 py-2 mt-2 bg-white border rounded-md shadow-md">
                              <li
                                onClick={() => {
                                  handleOpenModal("delete", product);
                                }}
                                className="px-4 py-2 font-medium text-gray-700 border-b hover:bg-gray-100"
                              >
                                Delete
                              </li>
                            </ul>
                          )
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Deals List */}
            <div className={`${!useDrawer && "hidden"} mt-4`}>
              {<ProductList
                useDrawer={useDrawer}
                allDocs={allDocs}
                menuVisible={menuVisible}
                menuToggle={menuToggle}
                handleSetMenuToggle={handleSetMenuToggle}
                handleOpenModal={handleOpenModal}
              />}
            </div>
          </>
        )}
        {/* Orders Display */}
        {/* Desktop Orders Display  Table View*/}
        {activePage === "orders" && (
          <>
            <div
              className={`${useDrawer && "hidden"} px-[16px] md:px-[64px] mt-4`}
            >
              <table className="w-full text-base font-normal text-left text-white table-auto">
                <thead className="bg-black ">
                  <tr>
                    <th
                      scope="col"
                      className="px-2 py-4 pl-4 font-normal rounded-l-md"
                    >
                      Product Name
                    </th>

                    <th scope="col" className="py-4 font-normal ">
                      Qty
                    </th>
                    <th scope="col" className="py-4 font-normal ">
                      Amount
                    </th>
                    <th scope="col" className="px-4 py-4 font-normal text-center">
                      User
                    </th>
                    <th scope="col" className="px-2 py-4 font-normal text-center">
                      Phone
                    </th>
                    <th scope="col" className="px-2 py-4 font-normal text-center">
                      Address
                    </th>
                    <th scope="col" className="px-2 py-4 font-normal text-center">
                      Details
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-4 font-normal rounded-r-md"
                    ></th>
                  </tr>
                </thead>

                {/* //TABLE ROWS */}
                {/* .filter((order) => order.paid === false && order.delivered === true) */}
                <tbody>
                  {orderDocs
                    .filter(
                      (order) => order.paid === false || order.delivered === false
                    )
                    .map((order, index) => (
                      <tr
                        key={order[index]}
                        className="bg-white border-b cursor-pointer border-slate-100 hover:bg-gray-50"
                      >
                        <td className="py-6 pl-4 text-gray-700">
                          {order.selectedProducts.map((product) => (
                            <div>{product.productName}</div>
                          ))}
                        </td>
                        <td className="py-4 text-gray-700">
                          {order.selectedProducts.map((product) => (
                            <div>{product.value}</div>
                          ))}
                        </td>
                        <td className="py-4 text-gray-700">
                          GH₵ {order.discountedValue}
                        </td>
                        <td className="text-center text-gray-700">
                          {order.userName}
                        </td>
                        <td className="px-4 py-4 text-center text-gray-700">
                          {order.userPhone}
                        </td>
                        <td className="truncate px-4 py-4 text-center text-gray-700">
                          {order.userAddress}
                        </td>
                        <td className="px-4 py-4 text-center text-gray-700">
                          <div className="flex text-[12px] gap-1 mt-3 justify-center">
                            <div
                              className={`items-center ${order.paid === false
                                ? "bg-[#ffc1c1] border border-[#ff8181] text-[#571111] py-1 px-2 rounded-md"
                                : "bg-[#ccffc1] border border-[#adffab] text-[#115720] py-1 px-2 rounded-md"
                                }`}
                            >
                              {order.paid === false ? "Unpaid" : "Paid"}
                            </div>
                            <div
                              className={`items-center ${order.delivered === false
                                ? "bg-[#d6edff] border border-[#6ea5e4] text-[#112657] py-1 px-2 rounded-md"
                                : "bg-[#f3dcff] border border-[#d2abff] text-[#341157] py-1 px-2 rounded-md"
                                }`}
                            >
                              {order.delivered === false
                                ? "Undelivered"
                                : "Delivered"}
                            </div>
                          </div>
                        </td>
                        <td
                          onClick={() => {
                            handleSetMenuToggle(order.id);
                          }}
                          className="px-4 py-4 text-center text-gray-700"
                        >
                          <FaEllipsisV />
                        </td>
                        {menuToggle === order.id
                          ? menuVisible && (
                            <ul className="absolute right-12 z-10 py-2 mt-2 bg-white border rounded-md shadow-md">
                              <li
                                onClick={() => {
                                  upDatePaymentStatus(order.id);
                                }}
                                className="px-4 py-2 font-medium text-gray-700 border-b hover:bg-gray-100"
                              >
                                {loading ? "Updating Payment..." : " Mark Paid"}
                              </li>
                              <li
                                onClick={() => {
                                  updateDeliveryUpdate(order.id);
                                }}
                                className="px-4 py-2 font-medium text-gray-700 border-b hover:bg-gray-100"
                              >
                                {loading
                                  ? "Updating Delivery..."
                                  : "Mark Delivered"}
                              </li>
                            </ul>
                          )
                          : ""}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Orders List */}
            <div className={`${!useDrawer && "hidden"}`}>
              {orderDocs
                .filter(
                  (order) => order.paid === false || order.delivered === false
                )
                .map((order, index) => (
                  <div
                    className="m-[16px] flex items-center mt-3 bg-white rounded-lg px-4 py-3"
                    key={order.id}
                  >
                    <div className="w-full">
                      <div className="items-center ">
                        <div className="text-[14px] text-gray-500 border-b pb-2 flex items-center w-full justify-between">
                          <div>New Order for</div>

                          <div
                            className=" place-content-end"
                            onClick={() => {
                              handleSetMenuToggle(order.id);
                            }}
                          >
                            <FaEllipsisV className="text-gray-700" />
                          </div>
                          {menuToggle === order.id
                            ? menuVisible && (
                              <ul className="absolute right-12 z-10 py-2 mt-2 bg-white border rounded-md shadow-md">
                                <li
                                  onClick={() => {
                                    upDatePaymentStatus(order);
                                  }}
                                  className="px-4 py-2 font-medium text-gray-700 border-b hover:bg-gray-100"
                                >
                                  {loading
                                    ? "Updating Payment..."
                                    : " Mark Paid"}
                                </li>
                                <li
                                  onClick={() => {
                                    handleDeliveryUpdate(order);
                                  }}
                                  className="px-4 py-2 font-medium text-gray-700 border-b hover:bg-gray-100"
                                >
                                  {loading
                                    ? "Updating Delivery..."
                                    : "Mark Delivered"}
                                </li>
                              </ul>
                            )
                            : ""}
                        </div>

                        {order.selectedProducts.map((product) => (
                          <div
                            className="text-[16px] flex justify-between mt-2"
                            key={product.id}
                          >
                            <p className="mt-1">
                              {product.value} {product.measurement} of{" "}
                              {product.productName}
                            </p>
                            <p>GH₵ {product.currentPrice * product.value}</p>
                          </div>
                        ))}
                        <div className="flex text-[12px] gap-1 mt-3">
                          <div
                            className={`items-center ${order.paid === false
                              ? "bg-[#ffc1c1] border border-[#ff8181] text-[#571111] py-1 px-2 rounded-md"
                              : "bg-[#ccffc1] border border-[#adffab] text-[#115720] py-1 px-2 rounded-md"
                              }`}
                          >
                            {order.paid === false ? "Unpaid" : "Paid"}
                          </div>
                          <div
                            className={`items-center ${order.delivered === false
                              ? "bg-[#d6edff] border border-[#6ea5e4] text-[#112657] py-1 px-2 rounded-md"
                              : "bg-[#f3dcff] border border-[#d2abff] text-[#341157] py-1 px-2 rounded-md"
                              }`}
                          >
                            {order.delivered === false
                              ? "Undelivered"
                              : "Delivered"}
                          </div>
                        </div>

                        <div
                          className="mt-4 text-[14px] text-gray-500 border-b py-3 flex justify-between items-center"
                          onClick={() => {
                            setShowDetails((prevState) => ({
                              ...prevState,
                              [index]: !prevState[index],
                            }));
                          }}
                        >
                          <p>User Details</p>
                          {
                            <FaChevronCircleUp
                              className={`${showDetails && "-rotate-180"} `}
                            />
                          }
                        </div>

                        {showDetails[index] && (
                          <div className="mt-2">
                            <p className="mt-1 text-[14px] text-gray-500">
                              {order.userName}
                            </p>
                            <p className="mt-1 text-[14px] text-gray-500">
                              {order.userPhone}
                            </p>
                            <p className="mt-1 text-[14px] text-gray-500">
                              {order.userEmail}
                            </p>
                            <p className="mt-1 text-[14px] text-gray-500">
                              {order.userAddress}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        {activePage === "coupon" && (
          <>
            {/* Desktop Coupon View Table */}
            <div
              className={`${useDrawer && "hidden"} px-[16px] md:px-[64px] mt-4`}
            >
              <table className="w-full text-base font-normal text-left text-white table-auto">
                <thead className="bg-black ">
                  <tr>
                    <th
                      scope="col"
                      className="px-2 py-4 pl-4 font-normal rounded-l-md"
                    >
                      Coupon Holder
                    </th>
                    <th scope="col" className="py-4 font-normal">
                      Discount Code
                    </th>
                    <th scope="col" className="py-4 font-normal ">
                      Discount %
                    </th>
                    <th scope="col" className="py-4 font-normal ">
                      Usage
                    </th>

                    <th
                      scope="col"
                      className="px-2 py-4 font-normal rounded-r-md"
                    ></th>
                  </tr>
                </thead>

                {/* //TABLE ROWS */}
                <tbody>
                  {couponDocs.map((coupon) => (
                    <tr
                      className="bg-white border-b cursor-pointer border-slate-100 hover:bg-gray-50"
                      key={coupon.id}
                    >
                      <td onClick={() => { }} className="py-6 pl-4 text-gray-700">
                        {coupon.holderName}
                      </td>
                      <td onClick={() => { }} className="py-4 text-gray-700">
                        {coupon.couponCode}
                      </td>
                      <td onClick={() => { }} className="py-6 pl-4 text-gray-700">
                        {coupon.discountPercent}
                      </td>
                      <td
                        onClick={() => { }}
                        className="text-gray-700"
                      >
                        {coupon.couponUsage.length}
                      </td>
                      <td
                        className="px-4 py-4 text-gray-700"
                        onClick={() => {
                          handleSetMenuToggle(coupon.id);
                        }}
                      >
                        <FaEllipsisV />
                        {menuToggle === coupon.id
                          ? menuVisible && (
                            <ul className="absolute right-12 z-10 py-2 mt-2 bg-white border rounded-md shadow-md">
                              <li
                                onClick={() => {
                                  handleOpenModal("delete", coupon);
                                }}
                                className="px-4 py-2 font-medium text-gray-700 border-b hover:bg-gray-100"
                              >
                                Delete
                              </li>
                            </ul>
                          )
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Deals List */}
            <div className={`${!useDrawer && "hidden"} mt-4`}>
              {couponDocs.map((coupon) => (
                <div
                  key={coupon.id}
                  className="mx-[16px] flex items-center mt-3 bg-white rounded-lg px-4 py-4"
                >
                  <div className="w-full">

                    <div className="flex items-center text-gray-700">
                      <div className="flex w-full"><div className="w-1/2 text-gray-600">Coupon Code: </div> <div>{coupon.couponCode}</div></div>
                      <div
                        className="flex place-content-end"
                        onClick={() => {
                          handleSetMenuToggle(coupon.id);
                        }}
                      >
                        <FaEllipsisV className="text-gray-700" />
                      </div>
                      {menuToggle === coupon.id
                        ? menuVisible && (
                          <ul className="absolute right-12 z-10 py-2 mt-2 bg-white border rounded-md shadow-md">
                            <li
                              onClick={() => {
                                handleOpenModal(coupon);
                              }}
                              className="px-4 py-2 font-medium text-gray-700 border-b hover:bg-gray-100"
                            >
                              Delete
                            </li>
                          </ul>
                        )
                        : ""}
                    </div>
                    <div className="flex w-full"><div className="w-1/2 text-gray-600">Coupon Holder:</div> <div>{coupon.holderName}</div></div>
                    <div className="flex w-full"><div className="w-1/2 text-gray-600">Coupon %:</div> <div>{coupon.discountPercent}%</div></div>
                    <div className="flex w-full"><div className="w-1/2 text-gray-600">Coupon Usage:</div> <div>{coupon.couponUsage.length}</div></div>

                  </div>
                </div>
              ))}
            </div>
          </>)}</div>

      {/*Desktop  Add new Deals popup */}
      {modalVisible && openModal === "addDeal" && !useDrawer && (
        <Modal
          open={modalVisible}
          onOk={handleOkAndCancel}
          onCancel={handleOkAndCancel}
          centered={true}
          footer={false}
          closable={true}
          title={<div className="text-[24px]">Add New Deal</div>}
          width={480}
        >
          <AddDealForm
            productName={productName}
            setProductName={setProductName}
            oldPrice={oldPrice}
            setOldPrice={setOldPrice}
            newPrice={newPrice}
            setNewPrice={setNewPrice}
            quantity={quantity}
            setQuantity={setQuantity}
            unit={unit}
            setUnit={setUnit}
            startDate={startDate}
            setStartDate={setStartDate}
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            isAdditionValid={isAdditionValid}
            handleAddDeal={handleAddDeal}
            setImage={setImage}
            loading={loading}
            resetFormVariables={resetFormVariables}
          />
        </Modal>
      )}
      {/* Mobile Add new Deals Drawer */}
      {modalVisible && openModal === "addDeal" && useDrawer && (
        <Drawer
          placement="bottom"
          closable={false}
          onClose={handleOkAndCancel}
          key="bottom"
          className="rounded-t-xl"
          height="90%"
          open={modalVisible}
          title={<div className="text-[24px]">Add New Deal</div>}
        >
          <AddDealForm
            productName={productName}
            setProductName={setProductName}
            oldPrice={oldPrice}
            setOldPrice={setOldPrice}
            newPrice={newPrice}
            setNewPrice={setNewPrice}
            quantity={quantity}
            setQuantity={setQuantity}
            unit={unit}
            setUnit={setUnit}
            startDate={startDate}
            setStartDate={setStartDate}
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            isAdditionValid={isAdditionValid}
            handleAddDeal={handleAddDeal}
            setImage={setImage}
            loading={loading}
            resetFormVariables={resetFormVariables}
          />
        </Drawer>
      )}
      {modalVisible && openModal === "coupon" && !useDrawer && (
        <Modal
          open={modalVisible}
          onOk={handleOkAndCancel}
          onCancel={handleOkAndCancel}
          centered={true}
          footer={false}
          closable={true}
          title={<div className="text-[24px]">Add New Coupon</div>}
          width={480}
        >
          <AdminAddCoupon setHolderName={setHoldername}
            holderName={holderName}
            setDiscountPercent={setDiscountPercent}
            discountPercent={discountPercent}
            isFormValid={isFormValid}
            handleCreateCoupon={handleCreateCoupon}
            onCouponCodeGenerated={onCouponCodeGenerated}
            loading={loading}
            resetFormVariables={resetCouponVariable}
          />
        </Modal>
      )}

      {/* Mobile Add new Deals Drawer */}
      {modalVisible && openModal === "coupon" && useDrawer && (
        <Drawer
          placement="bottom"
          closable={false}
          onClose={handleOkAndCancel}
          key="bottom"
          className="rounded-t-xl"
          height="90%"
          open={modalVisible}
          title={<div className="text-[24px]">Add New Coupon</div>}
        >
          <AdminAddCoupon setHolderName={setHoldername}
            holderName={holderName}
            setDiscountPercent={setDiscountPercent}
            discountPercent={discountPercent}
            isFormValid={isFormValid}
            handleCreateCoupon={handleCreateCoupon}
            onCouponCodeGenerated={onCouponCodeGenerated}
            loading={loading}
            resetFormVariables={resetCouponVariable}
          />
        </Drawer>
      )}

      {/* Success Deal popup */}
      {modalVisible && openModal === "success" && (
        <Modal
          open={modalVisible}
          onOk={handleOkAndCancel}
          onCancel={handleOkAndCancel}
          centered={true}
          footer={false}
          closable={true}
          width={240}
        >
          {
            <div className="w-full text-center place-items-center">
              <FaExclamationCircle
                size={32}
                className="text-[#E71D36] w-full mt-8"
              />
              <div className="mt-4 text-base font-medium boder-b">
                Delete {modalData.productName}?
              </div>

              <div className="w-full mt-8">
                <div
                  className="w-full text-[16px] text-center cursor-pointer capitalize bg-green hover:bg-[#0f5c2e] py-4 rounded-md text-white"
                  onClick={() => {
                    handleConfirmDelete();
                  }}
                >
                  Delete
                </div>
                <div
                  className="mt-6 cursor-pointer"
                  onClick={() => handleOkAndCancel()}
                >
                  Cancel
                </div>
              </div>
            </div>
          }
        </Modal>
      )}

      {/* Delete popup */}
      {modalVisible && openModal === "delete" && (
        <Modal
          open={modalVisible}
          onOk={handleOkAndCancel}
          onCancel={handleOkAndCancel}
          centered={true}
          footer={false}
          closable={true}
          width={240}
        >
          {
            <div className="w-full text-center place-items-center">
              <FaExclamationCircle
                size={32}
                className="text-[#E71D36] w-full mt-8"
              />
              <div className="mt-4 text-base font-medium boder-b">
                Delete {modalData.productName}?
              </div>

              <div className=" mt-8">
                <div
                  className=" text-[16px] w-full text-center cursor-pointer capitalize bg-green hover:bg-[#0f5c2e] px-8 py-4 rounded-md text-white"
                  onClick={() => {
                    handleConfirmDelete(modalData.id);
                  }}
                >
                  Delete
                </div>
                <div
                  className="mt-6 cursor-pointer"
                  onClick={() => handleOkAndCancel()}
                >
                  Cancel
                </div>
              </div>
            </div>
          }
        </Modal>
      )}

      {/*Desktop  View History popup */}
      {modalVisible && openModal === "history" && !useDrawer && (
        <Modal
          open={modalVisible}
          onOk={handleOkAndCancel}
          onCancel={handleOkAndCancel}
          centered={true}
          footer={false}
          closable={true}
          title={<div className="text-[24px]">Completed Orders</div>}
          width={480}
        >
          <div className="h-[75vh] overflow-y-auto ">
            {orderDocs
              .filter(
                (order) => order.paid !== false || order.delivered !== false
              )
              .map((order, index) => (
                <div className="bg-gray-50 px-4 py-2 mb-2 rounded-md">
                  <div className="justify-between flex">
                    <p className="text-[16px] font-medium">{order.userName}</p>
                    <p>GH₵ {order.totalValue}</p>
                  </div>
                  {order.selectedProducts.map((product) => (
                    <p key={product.id} className="mt-1">
                      {product.value} {product.measurement} of{" "}
                      {product.productName}
                    </p>
                  ))}
                </div>
              ))}
          </div>
        </Modal>
      )}

      {/*Mobile  View History Drawer */}
      {modalVisible && openModal === "history" && useDrawer && (
        <Drawer
          placement="bottom"
          closable={false}
          onClose={handleOkAndCancel}
          key="bottom"
          className="rounded-t-xl"
          height="90%"
          open={modalVisible}
          title={<div className="text-[24px]">Completed Orders</div>}
        >
          <div className="h-[75vh] overflow-y-auto">
            {orderDocs
              .filter(
                (order) => order.paid !== false || order.delivered !== false
              )
              .map((order, index) => (
                <div className="bg-gray-50 px-4 py-2 mb-2 rounded-md">
                  <div className="justify-between flex">
                    <p className="text-[16px] font-medium">{order.userName}</p>
                    <p>GH₵ {order.totalValue}</p>
                  </div>
                  {order.selectedProducts.map((product) => (
                    <p key={product.id} className="mt-1">
                      {product.value} {product.measurement} of{" "}
                      {product.productName}
                    </p>
                  ))}
                </div>
              ))}
          </div>
        </Drawer>
      )}
      <SparkFooter />
    </div>
  );
};

export default AdminPage;
