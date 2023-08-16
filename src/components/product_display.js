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
    <div className={`bg-white h-96 md:h-auto p-[8px] rounded-lg ${classExtra}`}>
     <div className="h-[50%] md:h-[70%] mx-auto mb-4 flex items-center justify-center overflow-hidden rounded-md">
        <img src={image} alt="" className="h-full object-cover " />
      </div>
      <div className="p-[4px] mt-4 md:mt-0 md:p-[16px]">
        <div className="md:flex justify-between items-center">
        <div className="md:hidden mb-2 w-fit text-[12px] text-[#327531] border border-[#A4FF8D] bg-[#CAFFC1] px-4 py-[1px] rounded-sm">
            -{discount}%
          </div>
          <div className="text-gray-500 text-[14px] md:text-[16px]">{productName}</div>
          <div className="hidden w-fit text-[14px] text-[#327531] border border-[#A4FF8D] bg-[#CAFFC1] px-4 py-[1px] rounded-sm">
            -{discount}%
          </div>
        </div>
        <div className="text-gray-800 text-[18px] md:text-[24px] font-medium">
          GH₵ {currentPrice}
        </div>
        <div className="text-[14px] md:text-[16px] text-gray-500 font-base">
          {availaBleQTY} {measurement} Available
        </div>
        <div
          className="cursor-pointer mt-4 md:mt-8 capitalize bg-green hover:bg-[#0f5c2e] px-4 md:px-8 py-3 md:py-4 rounded-md text-white w-full text-center md:w-fit"
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
