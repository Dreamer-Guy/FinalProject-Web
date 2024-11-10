import mockProductService from "../Product/mockService.js";
import mockProductDetailsService from "../ProductDetails/mockService.js";
import dbProductService from "../Product/dbService.js";
import dbProductDetailsService from "../ProductDetails/dbService.js";
const productService=dbProductService;
const productDetailsServce=dbProductDetailsService;
const serviceFactory = {
    getProductSerVice:()=>{
        return productService;
    },
    getProductDetailsSerVice:()=>{
        return productDetailsServce;
    },
};

export default serviceFactory;