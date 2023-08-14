import React from "react";
import { Header } from "./components/header";
import ProductCard from "./components/product_display";

const DealsPage = () => {
  return (
    <div className="">
      <Header />
      <div className="m-[64px] grid grid-cols-3 gap-12">
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </div>
  );
};

export default DealsPage;
