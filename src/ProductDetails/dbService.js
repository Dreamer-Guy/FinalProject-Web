import mongoose from "mongoose";
import productDetails from "../Model/ProductDetails.js";

const productDetailsService={
    get:async(id)=>{
        try{
            console.log(id);
        const productDetailsRes=await productDetails.findOne({productId:id});
        console.log("ad");
        return productDetailsRes;
        }
        catch(e){
            console.log(e);
            return null;
        }
    },  
    getAll:async()=>{
        const allProductDetails=await productDetails.find();
        return allProductDetails;
    },
};

export default productDetailsService;