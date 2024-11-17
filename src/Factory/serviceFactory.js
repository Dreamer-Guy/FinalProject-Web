import mockProductService from "../Product/mockService.js";
import mockProductDetailsService from "../ProductDetails/mockService.js";
import dbProductService from "../Product/dbService.js";
import dbProductDetailsService from "../ProductDetails/dbService.js";
import dbUserService from "../User/dbService.js";
import dbReviewService from "../Review/dbService.js";
import dbCartService from "../Cart/dbService.js"

const productService=dbProductService;
const productDetailsServce=dbProductDetailsService;
const userService=dbUserService;
const reviewService=dbReviewService;
const cartService=dbCartService;

const serviceFactory = {
    getProductSerVice:()=>{
        return productService;
    },
    getProductDetailsSerVice:()=>{
        return productDetailsServce;
    },
    getUserService:()=>{
        return userService;
    },
    getReviewService:()=>{
        return reviewService;
    },
    getCartService:()=>{
        return cartService;
    }
};

export default serviceFactory;