import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  addDoc,
  serverTimestamp,
  collection,
  doc,
  deleteDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "sparkdeals-a9107.firebaseapp.com",
  projectId: "sparkdeals-a9107",
  storageBucket: "sparkdeals-a9107.appspot.com",
  messagingSenderId: "697702771938",
  appId: "1:697702771938:web:054736840b4fcb19af42bb",
  measurementId: "G-RJ866G4KDV",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export const handleDeleteDoc = async (documentId) => {
  try {
    const documentRef = doc(db, "deals", documentId);
    await deleteDoc(documentRef);
  } catch (error) {
    // return "Error deleting document: ", error;
  }
};

export const handleFile = (image) => {
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

export const handleSubmit = (
  productName,
  oldPrice,
  newPrice,
  quantity,
  unit,
  discount,
  startDate,
  expiryDate,
  imageFile
) => {
  handleFile(imageFile)
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
        createdAt: serverTimestamp(),
      }).then(() => {
        return true;
      });
    })
    .catch((error) => {
      return error;
    });
};

export const handleProcessingOrder = async (newOrder) => {
  try {
    const collectionRef = collection(db, "orders");

    await addDoc(collectionRef, newOrder).then(() => {
      return true;
    });
  } catch (error) {
    // return "Error deleting document: ", error;
  }
};

export const handlePaymentUpdate = async (orderId) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      paid: true,
    }).then(() => {
      return true;
    });
  } catch (error) {
    return error;
  }
};

export const handleDeliveryUpdate = async (orderId) => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      delivered: true,
    }).then(() => {
      return true;
    });
  } catch (error) {
    return error;
  }
};

export const useFetchData = (collectionName) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dataRef = collection(db, collectionName);
      const querySnapshot = await getDocs(dataRef);
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      setData(documents);
    };
    fetchData();
  }, [collectionName]);

  return data;
};
