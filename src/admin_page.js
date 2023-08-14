import React from "react";
import { Header } from "./components/header";

const AdminPage = () => {
  return (
    <div>
      <Header />
      <div className="flex justify-between mt-24 border-b items-center ">
        <h2 >Admin Page</h2>
        <div
          className="text-[16px] w-content text-center cursor-pointer capitalize bg-green hover:bg-[#0f5c2e] px-8 py-4 rounded-md text-white w-fit"
          onClick={() => {}}
        >
          {" "}
          Add new Deal
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
