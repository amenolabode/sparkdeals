import React, { useState, useEffect } from "react";
import { Header } from "./components/header";
import Input from "antd/es/input/Input";
import { addDoc } from "firebase/firestore";
import { collection, doc, deleteDoc, getDocs } from "firebase/firestore";
import { db, storage } from "./utils/init_firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { Modal, Drawer, DatePicker } from "antd";
import { FaEllipsisV, FaExclamationCircle } from "react-icons/fa";

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
  const [expiryDate, setExpiryDate] = useState("deals");
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuToggle, setMenuToggle] = useState("");
  const [modalVisible, setModalVisible] = useState("");
  const [modalData, setModalData] = useState("");

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

  const handleDateChange = (dateString) => {
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
  }, [openModal, productName]);

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
  }, [openModal, productName]);

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

  const handleSubmit = () => {
    handleFile()
      .then((imageURL) => {
        const collectionRef = collection(db, "deals");
        addDoc(collectionRef, {
          imageURL,
          productName,
          oldPrice,
          expiryDate,
          currentPrice: newPrice,
          availableQTY: quantity,
          measurement: unit,
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

  const isAdditionValid =
    productName !== "" &&
    oldPrice !== 0 &&
    newPrice !== 0 &&
    quantity !== 0 &&
    unit !== "" &&
    image !== null &&
    expiryDate !== "";

  const AddDealForm = () => {
    return (<div className="mx-auto">
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
      <Input
        className="w-full h-[48px] hover:border-green-500 active:border-green-600"
        placeholder="Kg, Pieces, Packs"
        value={unit}
        required={true}
        onChange={(e) => setUnit(e.target.value)}
      />
    </div>
    <div className="mt-4">
      <div className="mb-1">
        <label className="text-gray-500"> Deal Expiry Date</label>
      </div>
      <DatePicker
        className="w-full"
        onChange={(date, dateString) => handleDateChange(dateString)}
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
  </div>);
    
  };

  return (
    <div>
      <Header />
      <div className="mx-[16px] md:mx-[64px] bg-white flex justify-between mt-4 md:mt-32 py-4 items-center px-[16px] md:px-[32px] rounded-lg">
        <h2 className="text-[24px] font-medium">Admin Page</h2>
        <div
          className="text-[16px] w-content text-center cursor-pointer capitalize bg-green hover:bg-[#0f5c2e] px-8 py-4 rounded-md text-white w-fit"
          onClick={() => {
            setModalVisible(true);
            setOpenModal("addDeal");
          }}
        >
          {" "}
          Add new Deal
        </div>
      </div>
      <div className="flex px-[16px] md:mx-[64px] mt-4 md:mt-8 w-full">
        {" "}
        <div
          className={`cursor-pointer ${
            activePage === "deals" && "bg-green text-white rounded-md"
          } px-8 py-2 text-gray-600`}
          onClick={() => setActivePage("deals")}
        >
          Deals
        </div>
        <div
          className={`cursor-pointer ${
            activePage === "orders" && "bg-green text-white rounded-md"
          } px-8 py-2 text-gray-600`}
          onClick={() => setActivePage("orders")}
        >
          Orders
        </div>
      </div>
      {activePage === "deals" && (
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
                      <div>
                        <FaEllipsisV />
                      </div>
                      {menuToggle === product.id
                        ? menuVisible && (
                            <ul className="absolute right-12 z-10 py-2 mt-2 bg-white border rounded-md shadow-md">
                              <li
                                onClick={() => {
                                  // handleOpenModal(trip, "info");
                                }}
                                className="px-4 py-2 font-medium text-gray-700 border-b hover:bg-gray-100"
                              >
                                View
                              </li>
                              <li
                                onClick={() => {
                                  // handleOpenModal(trip, "edit");
                                }}
                                className="px-4 py-2 font-medium text-gray-700 border-b hover:bg-gray-100"
                              >
                                Edit
                              </li>
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

          <div className={`${!useDrawer && "hidden"}`}>
            {allDocs.map((product) => (
              <div
                // key={index}
                className="mx-[16px] flex items-center mt-3 bg-white rounded-lg px-4 py-2"
              >
                <div className="w-full">
                  <div className="w-full text-[16px] font-medium mb-1">
                    {product.productName}
                  </div>

                  <div className="flex items-center">
                    <p className="text-[14px] text-gray-500">
                      GH₵ {product.currentPrice}
                    </p>
                    <div className="mx-2 rounded-[12px] h-1 w-1 bg-gray-300"></div>
                    <p className="text-[14px] text-gray-500">
                      {product.availableQTY} {product.measurement} Available
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
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

                  <th
                    scope="col"
                    className="px-2 py-4 font-normal rounded-r-md"
                  ></th>
                </tr>
              </thead>

              {/* //TABLE ROWS */}
              <tbody>
                {orderDocs.map((order) => (
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
                      <FaEllipsisV />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`${!useDrawer && "hidden"}`}>
            {orderDocs.map((order) => (
              <div className="mx-[16px] flex items-center mt-3 bg-white rounded-lg px-4 py-2">
                <div className="w-full">
                  <div className="w-full text-[16px] font-medium mb-1">
                    {order.selectedProducts.map((product) => (
                      <div className="flex items-center">
                        <div className="mr-4">{product.productName}</div>
                        <div className="text-[12px] text-[#327531] border border-[#A4FF8D] bg-[#CAFFC1] px-4 py-[1px] rounded-md">
                          {product.value} {product.measurement}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center">
                    <p className="text-[14px] text-gray-500">
                      {order.userName}
                    </p>
                    <div className="mx-2 rounded-[12px] h-1 w-1 bg-gray-300"></div>
                    <p className="text-[14px] text-gray-500">
                      {order.userPhone}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
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
      )}{" "}
      {modalVisible && openModal === "addDeal" && useDrawer && (
        <Drawer
          placement="bottom"
          closable={false}
          onClose={handleCancel}
          key="bottom"
          className="rounded-t-xl"
          height="95%"
          open={modalVisible}
          title={<div className="text-[24px]">Add New Deal</div>}
        >
          {AddDealForm()}
        </Drawer>
      )}
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
    </div>
  );
};

export default AdminPage;
