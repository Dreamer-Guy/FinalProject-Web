import mockProductService from "../Product/Shop/mockService.js";
import mockProductDetailsService from "../ProductDetails/Shop/mockService.js";
import dbProductService from "../Product/dbService.js";
import dbProductDetailsService from "../ProductDetails/dbService.js";
import dbUserService from "../User/dbService.js";
import dbReviewService from "../Review/dbService.js";
import dbCartService from "../Cart/dbService.js";
import dbOrderService from "../Order/dbService.js";
import dbAddressService from "../Address/dbService.js";
import dbForgotPasswordService from "../UtilServices/dbServiceForgotPassowordToken.js";
import dbProductPropertyService from "../ProductProperty/dbService.js";
import dbCategoryService from "../Category/dbService.js";
import dbBrandService from "../Brand/dbService.js";

const productService=dbProductService;
const productDetailsServce=dbProductDetailsService;
const userService=dbUserService;
const reviewService=dbReviewService;
const cartService=dbCartService;
const orderService=dbOrderService;
const addressService=dbAddressService;
const forgotPasswordService=dbForgotPasswordService;
const productPropertyService=dbProductPropertyService;
const brandService=dbBrandService;
const categoryService=dbCategoryService;

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
    },
    getOrderService:()=>{
        return orderService;
    },
    getAddressService:()=>{
        return addressService;
    },
    getForgotPasswordTokenService:()=>{
        return forgotPasswordService;
    },
    getProductPropertyService:()=>{
        return productPropertyService;
    },
    getBrandService:()=>{
        return brandService;
    },
    getCategoryService:()=>{
        return categoryService;
    },
};

export default serviceFactory;