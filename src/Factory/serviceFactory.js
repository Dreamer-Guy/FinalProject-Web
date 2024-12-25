
import dbProductService from "../Product/dbService.js";
import dbUserService from "../User/dbService.js";
import dbReviewService from "../Review/dbService.js";
import dbCartService from "../Cart/dbService.js";
import dbOrderService from "../Order/dbService.js";
import dbAddressService from "../Address/dbService.js";
import dbForgotPasswordService from "../UtilServices/dbServiceForgotPassowordToken.js";
import dbProductPropertyService from "../ProductProperty/dbService.js";
import dbCategoryService from "../Category/dbService.js";
import dbBrandService from "../Brand/dbService.js";
import dbBannerService from "../Banner/dbService.js";
import dbImagesProductService from "../ImagesProduct/dbService.js";
import elasticSearchService from "../UtilServices/ElasticSearchService/productService.js";
import suggesterService from "../UtilServices/ElasticSearchService/suggesterService.js"

const productService=dbProductService;
const userService=dbUserService;
const reviewService=dbReviewService;
const cartService=dbCartService;
const orderService=dbOrderService;
const addressService=dbAddressService;
const forgotPasswordService=dbForgotPasswordService;
const productPropertyService=dbProductPropertyService;
const brandService=dbBrandService;
const categoryService=dbCategoryService;
const bannerService=dbBannerService;

const serviceFactory = {
    getProductSerVice:()=>{
        return productService;
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
    getBannerService:()=>{
        return bannerService;
    },
    getImagesProductService:()=>{
        return dbImagesProductService;
    }
};

// const dosth=async()=>{
//     const orders=await orderService.getAllOrders();
//     const products=await productService.getAll();
//     await elasticSearchService.SynchronizeProductsToElastic(products);
//     await suggesterService.SynchronizeAllProducts(products);
//     await suggesterService.SynchronizeAllOrders(orders);
// }

// dosth();
export default serviceFactory;