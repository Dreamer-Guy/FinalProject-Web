import productDetails from "../Model/ProductDetails.js";

const productDetailsService={
    get:async(id)=>{
        const product=await productDetails.findById(id);
    },  
    getAll:async()=>{
        const allProductDetails=await productDetails.find();
        return allProductDetails;
    },
};

export default productDetailsService;