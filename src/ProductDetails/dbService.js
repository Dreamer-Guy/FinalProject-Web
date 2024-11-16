import mongoose from "mongoose";
import productDetails from "../Model/ProductDetails.js";

const productDetailsService={
    get:async(id)=>{
        const productDetailsRes=await productDetails.findOne({productId:id}).lean()||{};
        return productDetailsRes;
    },  
    getAll:async()=>{
        const allProductDetails=await productDetails.find();
        return allProductDetails;
    },
};

export default productDetailsService;