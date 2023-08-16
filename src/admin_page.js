import React, { useState, useEffect } from "react";
import { Header } from "./components/header";
import Input from "antd/es/input/Input";
import { addDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "./utils/init_firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { Modal } from "antd";
import { FaEllipsisV } from "react-icons/fa";

const initialState = {
  productName: "",
  oldPrice: "",
  currentPrice: 0,
  availableQTY: 0,
  measurement: "",
};
const AdminPage = () => {
  const [productName, setProductName] = useState("");
  const [oldPrice, setOldPrice] = useState(0);
  const [newPrice, setNewPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("");
  const [image, setImage] = useState(null);
  const [newDeal, setNewdeal] = useState(false);
  const [allDocs, setAllDocs] = useState([]);
  const [imageURL, setImageURL] = useState("");

  const handleOk = () => {
    setNewdeal(false);
  };

  const handleCancel = () => {
    setNewdeal(false);
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
  }, [newDeal]);

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

    setNewdeal(false);
  };

  const isAdditionValid =
    productName !== "" &&
    oldPrice !== 0 &&
    newPrice !== 0 &&
    quantity !== 0 &&
    unit !== "" &&
    image !== null;

  return (
    <div>
      <Header />

      <div className="flex justify-between mt-24 pb-4 items-center px-[64px]">
        <h2 className="text-[24px] font-medium">Admin Page</h2>
        <div
          className="text-[16px] w-content text-center cursor-pointer capitalize bg-green hover:bg-[#0f5c2e] px-8 py-4 rounded-md text-white w-fit"
          onClick={() => {
            setNewdeal(!newDeal);
          }}
        >
          {" "}
          Add new Deal
        </div>
      </div>

      <div className="px-[64px]">
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
                <td onClick={() => {}} className="text-center text-gray-700">
                  {product.availableQTY}
                </td>
                <td
                  onClick={() => {}}
                  className="px-4 py-4 text-center text-gray-700"
                >
                  {product.measurement}
                </td>
                <td
                  onClick={() => {}}
                  className="px-4 py-4 text-center text-gray-700"
                >
                  <FaEllipsisV />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {newDeal && (
        <Modal
          open={newDeal}
          onOk={handleOk}
          onCancel={handleCancel}
          centered={true}
          footer={false}
          closable={true}
          title={<div className="text-[24px]">Add New Deal</div>}
          width={480}
        >
          {
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
                  <label className="text-gray-500">
                    {" "}
                    Unit (Kg, Pieces, Packs){" "}
                  </label>
                </div>
                <Input
                  className="w-full h-[48px] hover:border-green-500 active:border-green-600"
                  placeholder="Kg, Pieces, Packs"
                  value={unit}
                  required={true}
                  onChange={(e) => setUnit(e.target.value)}
                />
              </div>

              <div
                className={`${
                  isAdditionValid
                    ? "bg-green hover:bg-[#0f5c2e] text-white"
                    : "bg-gray-200 text-gray-500"
                } text-[16px] w-full mt-8 text-center cursor-pointer capitalize  px-8 py-4 rounded-md w-fit`}
                onClick={isAdditionValid && handleSubmit}
              >
                {" "}
                Add Deal
              </div>
            </div>
          }
        </Modal>
      )}
    </div>
  );
};

export default AdminPage;
