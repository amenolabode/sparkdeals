import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";

const ProductCard = ({
  image,
  productName,
  OnClick,
  oldPrice,
  currentPrice,
  discount,
}) => {
  return (
    <div className="bg-white p-[8px] rounded-lg">
      <img src="./assets/test.png" alt="" />
      <div className="p-[16px]">
        <div className="flex justify-between items-center">
          <div className="text-gray-500">Test Product</div>
          <div className="text-[12px] text-[#327531] border border-[#A4FF8D] bg-[#CAFFC1] px-4 py-[1px] rounded-sm">
            -12%
          </div>
        </div>
        <div className="text-gray-800 text-[24px] font-medium">GHC 500</div>
        <div className="text-gray-500 text-[16px] font-base">
          10 Bags Available
        </div>
        <div
          className="mt-8 capitalize bg-green px-8 py-4 rounded-md text-white w-fit"
          onClick={OnClick}
        >
          {" "}
          Add to Cart
        </div>
      </div>
    </div>
    // <Card>
    //   <CardActionArea>
    //     <CardMedia
    //       component="img"
    //       height="140"
    //       //   image={image}
    //       image="./assets/test.jpg"

    //     />
    //     <CardContent>
    //
    //       <Typography gutterBottom variant="h5" component="div">
    //         Test Product
    //       </Typography>
    //       <div className="">Product Price</div>
    //     </CardContent>
    //   </CardActionArea>
    //   <CardActions>
    //     <div
    //       className="mb-4 capitalize bg-green px-8 py-4 rounded-md text-white"
    //       onClick={OnClick}
    //     >
    //       {" "}
    //       Add to Cart
    //     </div>
    //   </CardActions>
    // </Card>
  );
};

export default ProductCard;
