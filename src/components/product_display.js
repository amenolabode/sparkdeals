import React from "react";

const ProductCard = ({
  image,
  productName,
  OnClick,
  oldPrice,
  currentPrice,
  availaBleQTY,
  measurement,
  classExtra
}) => {
  const discount = Math.floor(100 - (currentPrice / oldPrice) * 100);

  return (
    <div className={`bg-white p-[8px] rounded-lg ${classExtra}`}>
      <img src={image} alt="" />
      <div className="p-[16px]">
        <div className="flex justify-between items-center">
          <div className="text-gray-500">{productName}</div>
          <div className="text-[12px] text-[#327531] border border-[#A4FF8D] bg-[#CAFFC1] px-4 py-[1px] rounded-sm">
            -{discount}%
          </div>
        </div>
        <div className="text-gray-800 text-[24px] font-medium">
          GH₵ {currentPrice}
        </div>
        <div className="text-gray-500 text-[16px] font-base">
          {availaBleQTY} {measurement} Available
        </div>
        <div
          className="cursor-pointer mt-8 capitalize bg-green hover:bg-[#0f5c2e] px-8 py-4 rounded-md text-white w-full text-center md:w-fit"
          onClick={OnClick}
        >
          {" "}
          Get this deal
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
