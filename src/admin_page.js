import React, { useState, useEffect } from "react";
import { Header } from "./components/header";
import Input from "antd/es/input/Input";
import { addDoc } from "firebase/firestore";
import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "./utils/init_firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { Modal, Drawer, DatePicker } from "antd";
import {
  FaChevronCircleUp,
  FaEllipsisV,
  FaExclamationCircle,
  FaPlus,
} from "react-icons/fa";

const AdminPage = () => {
  const [productName, setProductName] = useState("");
  const [oldPrice, setOldPrice] = useState(0);
  const [newPrice, setNewPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("");
  const [image, setImage] = useState(null);
  const [openModal, setOpenModal] = useState("");
  const [allDocs, setAllDocs] = useState([]);
  const [orderDocs, setOrderDocs] = useState([]);
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

  const handleSetMenuToggle = (value) => {
    if (menuToggle === value) {
      setMenuVisible(!menuVisible);
    } else {
      setMenuToggle(value);
    }
  };
  const handleOpenDeleteModal = (data) => {
    setOpenModal("delete");
    setModalVisible(true);
    setModalData(data);
  };

  const handleOpenHistory = () => {
    setOpenModal("history");
    setModalVisible(true);
    // setModalData(data);
  };

  const handleStartDateChange = (dateString) => {
    setStartDate(dateString);
  };
  const handleEndDateChange = (dateString) => {
    setExpiryDate(dateString);
  };

  const handleOk = () => {
    setOpenModal("");
    setModalVisible(false);
  };

  const handleCancel = () => {
    setOpenModal(false);
    setModalVisible(false);
  };

  const handleDeleteDoc = async (documentId) => {
    try {
      const documentRef = doc(db, "deals", documentId);
      await deleteDoc(documentRef);
      setMenuVisible(false);
      setModalVisible(false);
      setOpenModal("");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const ordersRef = collection(db, "orders");
      const querySnapshot = await getDocs(ordersRef);
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      setOrderDocs(documents);
    };
    fetchData();
  }, [openModal, productName, loading]);

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
  }, [openModal, productName, loading]);

  const handleFile = () => {
    return new Promise((resolve, reject) => {
      if (image == null) {
        reject("No image to upload");
        return;
      }
      const imageRef = ref(storage, `/images/${image.name + v4()}`);
      uploadBytes(imageRef, image)
        .then(() => {
          getDownloadURL(imageRef)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const discount = Math.floor(100 - (newPrice / oldPrice) * 100);

  const handlePaymentUpdate = async (orderId) => {
    try {
      setLoading(true);
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        paid: true,
      });

      setLoading(false);
      setMenuToggle("");
      setMenuVisible(false);
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };
  const handleDeliveryUpdate = async (orderId) => {
    try {
      setLoading(true);
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        delivered: true,
      });
      setLoading(false);
      setMenuToggle("");
      setMenuVisible(false);
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  const handleSubmit = () => {
    handleFile()
      .then((imageURL) => {
        const collectionRef = collection(db, "deals");
        addDoc(collectionRef, {
          imageURL,
          productName,
          oldPrice,
          expiryDate,
          startDate,
          currentPrice: newPrice,
          availableQTY: quantity,
          measurement: unit,
          discount,
        }).then(() => {
          setProductName("");
          setOldPrice(0);
          setNewPrice(0);
          setQuantity(0);
          setUnit("");
          setImage(null);
          alert("Deal Added Successfully");
        });
      })
      .catch((error) => {
        // console.error("Error handling file:", error);
      });
    setOpenModal("");
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

  const formatDate = (inputDate) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  const isAdditionValid =
    productName !== "" &&
    oldPrice !== 0 &&
    newPrice !== 0 &&
    quantity !== 0 &&
    unit !== "" &&
    image !== null &&
    expiryDate !== "" &&
    startDate !== "";

  const AddDealForm = () => {
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
            <option value="Kg">Kg</option>
            <option value="Bags">Bags</option>
            <option value="Pieces">Pieces</option>
            <option value="Keg">Keg</option>
            <option value="Pack">Pack</option>
            <option value="Box">Box</option>
          </select>
        </div>

        <div className="mt-4">
          <div className="mb-1">
            <label className="text-gray-500"> Deal Start Date</label>
          </div>
          <DatePicker
            className="w-full h-[48px]"
            onChange={(date, dateString) => handleStartDateChange(dateString)}
          />
        </div>
        <div className="mt-4">
          <div className="mb-1">
            <label className="text-gray-500"> Deal Expiry Date</label>
          </div>
          <DatePicker
            className="w-full h-[48px]"
            onChange={(date, dateString) => handleEndDateChange(dateString)}
          />
        </div>

        <div
          className={`${
            isAdditionValid
              ? "bg-green hover:bg-[#0f5c2e] text-white"
              : "bg-gray-200 text-gray-500"
          } text-[16px] w-full mt-8 text-center cursor-pointer capitalize  px-8 py-4 rounded-md w-fit`}
          onClick={isAdditionValid ? handleSubmit : undefined}
        >
          {" "}
          Add Deal
        </div>
      </div>
    );
  };

  return (
    <div>
      <Header />
      {/* Page */}
      {/* top */}
      <div className="mx-[16px] md:mx-[64px] bg-white flex justify-between mt-4 md:mt-32 py-4 items-center px-[16px] md:px-[32px] rounded-lg">
        <h2 className="text-[24px] font-medium">Admin Page</h2>
        <div
          className={`${
            useDrawer && "hidden"
          } text-[16px] w-content text-center cursor-pointer capitalize bg-green hover:bg-[#0f5c2e] px-8 py-4 rounded-md text-white w-fit`}
          onClick={() => {
            setModalVisible(true);
            setOpenModal("addDeal");
          }}
        >
          {" "}
          Add new Deal
        </div>
      </div>
      {/* Mobile Add Deal Button */}
      <div
        className={`${
          !useDrawer && "hidden"
        } fixed bottom-8 right-8 z-10 text-[16px] text-center cursor-pointer capitalize bg-green hover:bg-[#0f5c2e] px-8 py-8 rounded-[80px] text-white w-fit`}
        onClick={() => {
          setModalVisible(true);
          setOpenModal("addDeal");
        }}
      >
        <FaPlus size={18} />
      </div>
      {/* Deals and Orders Tab Group */}
      <div className="flex justify-between items-center px-[16px] md:mx-[64px] mt-4 md:mt-8 w-full">
        {" "}
        <div className="flex">
          <div
            className={`cursor-pointer ${
              activePage === "deals" && "bg-green text-white rounded-md"
            } px-4 md:px-8 py-2 text-gray-600`}
            onClick={() => setActivePage("deals")}
          >
            Deals
          </div>
          <div
            className={`cursor-pointer ${
              activePage === "orders" && "bg-green text-white rounded-md"
            } px-4 md:px-8 py-2 text-gray-600`}
            onClick={() => setActivePage("orders")}
          >
            Orders
          </div>
        </div>
        <div onClick={() => handleOpenHistory()} className="cursor-pointer text-green">
          view history
        </div>
      </div>
      {/* Active Page Display */}
      {/*  */}
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
                    <td onClick={() => {}} className="py-6 pl-4 text-gray-700">
                      {product.productName}
                    </td>
                    <td onClick={() => {}} className="py-4 text-gray-700">
                      {product.oldPrice}
                    </td>
                    <td onClick={() => {}} className="py-6 pl-4 text-gray-700">
                      {product.currentPrice}
                    </td>
                    <td
                      onClick={() => {}}
                      className="text-center text-gray-700"
                    >
                      {product.availableQTY}
                    </td>
                    <td
                      onClick={() => {}}
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
                                  handleOpenDeleteModal(product);
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
            {allDocs.map((product) => (
              <div className="mx-[16px] flex items-center mt-3 bg-white rounded-lg px-4 py-4">
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
                    {menuToggle === product.id
                      ? menuVisible && (
                          <ul className="absolute right-12 z-10 py-2 mt-2 bg-white border rounded-md shadow-md">
                            <li
                              onClick={() => {
                                handleOpenDeleteModal(product);
                              }}
                              className="px-4 py-2 font-medium text-gray-700 border-b hover:bg-gray-100"
                            >
                              Delete
                            </li>
                          </ul>
                        )
                      : ""}
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
        </>
      )}

      {/* Orders Display */}
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
                    Quantity
                  </th>
                  <th scope="col" className="px-4 py-4 font-normal text-center">
                    User
                  </th>
                  <th scope="col" className="px-2 py-4 font-normal text-center">
                    Phone
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
                  .map((order) => (
                    <tr className="bg-white border-b cursor-pointer border-slate-100 hover:bg-gray-50">
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
                      <td className="text-center text-gray-700">
                        {order.userName}
                      </td>
                      <td className="px-4 py-4 text-center text-gray-700">
                        {order.userPhone}
                      </td>
                      <td className="px-4 py-4 text-center text-gray-700">
                        <div className="flex text-[12px] gap-1 mt-3 justify-center">
                          <div
                            className={`items-center ${
                              order.paid === false
                                ? "bg-[#ffc1c1] border border-[#ff8181] text-[#571111] py-1 px-2 rounded-md"
                                : "bg-[#ccffc1] border border-[#adffab] text-[#115720] py-1 px-2 rounded-md"
                            }`}
                          >
                            {order.paid === false ? "Unpaid" : "Paid"}
                          </div>
                          <div
                            className={`items-center ${
                              order.delivered === false
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
                                  handlePaymentUpdate(order.id);
                                }}
                                className="px-4 py-2 font-medium text-gray-700 border-b hover:bg-gray-100"
                              >
                                {loading ? "Updating Payment..." : " Mark Paid"}
                              </li>
                              <li
                                onClick={() => {
                                  handleDeliveryUpdate(order.id);
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
                                    handlePaymentUpdate(order);
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
                          className={`items-center ${
                            order.paid === false
                              ? "bg-[#ffc1c1] border border-[#ff8181] text-[#571111] py-1 px-2 rounded-md"
                              : "bg-[#ccffc1] border border-[#adffab] text-[#115720] py-1 px-2 rounded-md"
                          }`}
                        >
                          {order.paid === false ? "Unpaid" : "Paid"}
                        </div>
                        <div
                          className={`items-center ${
                            order.delivered === false
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

      {/*Desktop  Add new Deals popup */}
      {modalVisible && openModal === "addDeal" && !useDrawer && (
        <Modal
          open={modalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          centered={true}
          footer={false}
          closable={true}
          title={<div className="text-[24px]">Add New Deal</div>}
          width={480}
        >
          {AddDealForm()}
        </Modal>
      )}

      {/* Mobile Add new Deals Drawer */}
      {modalVisible && openModal === "addDeal" && useDrawer && (
        <Drawer
          placement="bottom"
          closable={false}
          onClose={handleCancel}
          key="bottom"
          className="rounded-t-xl"
          height="90%"
          open={modalVisible}
          title={<div className="text-[24px]">Add New Deal</div>}
        >
          {AddDealForm()}
        </Drawer>
      )}

      {/* Delete Deal popup */}
      {modalVisible && openModal === "delete" && (
        <Modal
          open={modalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
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
                  className="w-full text-[16px] w-content text-center cursor-pointer capitalize bg-green hover:bg-[#0f5c2e] px-8 py-4 rounded-md text-white w-fit"
                  onClick={() => {
                    handleDeleteDoc(modalData.id);
                  }}
                >
                  Delete
                </div>
                <div className="mt-6 cursor-pointer">Cancel</div>
              </div>
            </div>
          }
        </Modal>
      )}

      {/* Success popup */}
      {modalVisible && openModal === "success  " && (
        <Modal
          open={modalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
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
                  className="w-full text-[16px] w-content text-center cursor-pointer capitalize bg-green hover:bg-[#0f5c2e] px-8 py-4 rounded-md text-white w-fit"
                  onClick={() => {
                    handleDeleteDoc(modalData.id);
                  }}
                >
                  Delete
                </div>
                <div className="mt-6 cursor-pointer">Cancel</div>
              </div>
            </div>
          }
        </Modal>
      )}

      {/*Desktop  View History popup */}
      {modalVisible && openModal === "history" && !useDrawer && (
        <Modal
          open={modalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          centered={true}
          footer={false}
          closable={true}
          title={<div className="text-[24px]">Completed Orders</div>}
          width={480}
        >
          {orderDocs
            .filter(
              (order) => order.paid === false || order.delivered === false
            )
            .map((order, index) => (
              <></>
            ))}
        </Modal>
      )}
    </div>
  );
};

export default AdminPage;
