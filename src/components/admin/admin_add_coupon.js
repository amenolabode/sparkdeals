import React, { useEffect, useState } from 'react'
import { Input } from "antd";

export const AdminAddCoupon = ({
    setHolderName,
    holderName,
    setDiscountPercent,
    discountPercent,
    isFormValid,
    handleCreateCoupon,
    onCouponCodeGenerated,
    loading,
    resetFormVariables }) => {

    const generateRandomCoupon = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const length = 6;
        let code = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
        return code;
    };

    const [couponCode, setCouponCode] = useState("");
    const generateCoupon = () => {
        const newCouponCode = generateRandomCoupon();
        setCouponCode(generateRandomCoupon());
        onCouponCodeGenerated(newCouponCode)
        setCouponCode(newCouponCode)
    };

    useEffect(() => {generateCoupon()}, [])


    return (
        <div className="mx-auto">
            <div className="mt-4">
                <div className="mb-1">
                    <label className="text-gray-500"> Coupon Holder Name </label>
                </div>
                <Input
                    className="w-full h-[48px] hover:border-green-500 active:border-green-600"
                    placeholder="Please enter Coupon Holder Name"
                    value={holderName}
                    required={true}
                    onChange={(e) => setHolderName(e.target.value)}
                />
            </div>
            <div className="mt-4">
                <div className="mb-1">
                    <label className="text-gray-500">Coupon Code</label>
                </div>
                <div className='flex items-center gap-8'>
                    {/* <button
                        className=" bg-green text-white h-[48px] px-6 py-2 rounded-lg"
                        onClick={generateCoupon}
                    >
                        Generate
                    </button> */}
                    <div className='text-[24px] font-medium text-gray-600'>{couponCode}</div>
                    {/* <Input
                        className="w-full h-[48px] hover:border-green-500 active:border-green-600"
                        placeholder="Coupon Code"
                        value={couponCode}
                        required={true}
                        readOnly
                    /> */}

                </div>
            </div>

            <div className="mt-4">
                <div className="mb-1">
                    <label className="text-gray-500"> Discount % </label>
                </div>
                <Input
                    className="w-full h-[48px] hover:border-green-500 active:border-green-600"
                    placeholder="Set Discount %"
                    value={discountPercent}
                    required={true}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                />
            </div>
            <div
                className={`${isFormValid
                    ? "bg-green hover:bg-[#0f5c2e] text-white"
                    : "bg-gray-200 text-gray-500"
                    } text-[16px] w-full mt-8 text-center cursor-pointer capitalize  px-8 py-4 rounded-md w-fit`}
                onClick={isFormValid ? handleCreateCoupon : undefined}
            >
                {" "}
                {loading ? "Creating Coupon..." : "Create Coupon"}
            </div>
        </div>
    )
}


