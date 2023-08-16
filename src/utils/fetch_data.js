import React, { useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./utils/init_firebase";

export const fetchData = async () => {
  const dealsRef = collection(db, "deals");
  const querySnapshot = await getDocs(dealsRef);

  const documents = [];
  querySnapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });

  return documents;
};
