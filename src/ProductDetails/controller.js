import { populate } from "dotenv";
import serviceFactory from "../Factory/serviceFactory.js";
import {generateRatingStars} from "../utils/viewEngine.js";
const productDetailService=serviceFactory.getProductDetailsSerVice();
const productService=serviceFactory.getProductSerVice();
const reviewService=serviceFactory.getReviewService(); 
const cartService=serviceFactory.getCartService(); 
const populateProduct=(product)=>{
    const populatedProduct={
        productId: product._id,
        type: product.type,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        brand: product.brand,
        totalStock: product.totalStock,
        image: product.image,
        rating: product.rating,
    };
    return populatedProduct;
}

const populateProductDetails=(productDetails)=>{
    const populatedProductDetails={};
    for(const key of Object.keys(productDetails)){
        if(key==='_id'){
            continue;
        }
        populatedProductDetails[key]=productDetails[key];
    }
    return populatedProductDetails;
};

const getFormatedDate=(date)=>{
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); 
    const dd = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;    
    return formattedDate;
};

const populateReview=(review)=>{
    const populatedReview={
        reviewId:review._id,
        user:{
            fullName:review.user.fullName,
            avatar:review.user.avatar,
        },
        rating:review.rating,
        comment:review.comment,
        createdAt:getFormatedDate(new Date(review.createdAt)),
    };
    return populatedReview; 
};


const getProductDetailsByID=async(req,res)=>{
    try{
        const user=req.user||null;
        const {id}=req.params;
        const productDetails=await productDetailService.get(id);
        const populatedProductDetails=populateProductDetails(productDetails);
        const product=await productService.getProductById(id);
        const rawRelatedProducts=await productService.getRelatedProducts(product)||[];
        const relatedProducts=rawRelatedProducts.map((product)=>populateProduct(product));
        const rawReviews=await reviewService.getReviewsByProductId(id);
        //tech-debt:check reviews
        const populatedReviews = rawReviews.map((review)=>populateReview(review));
        const productsInCart = await cartService.coutProductInCart(user._id);
        if(productDetails){
            return res.render('productDetails',{product,
                productDetails:populatedProductDetails,
                relatedProducts,
                reviews:populatedReviews,
                user:user,
                generateRatingStars,
                cartNumber:productsInCart,
            });
        }else{
            return res.json({
                data:null,
            })
        }
    }
    catch(error){
        return res.json({
            data:null,
        });
    }
}

// const getProductAllDetails=async(req,res)=>{
//     try{
//         const productDetails=await productDetailService.getAll();
//         if(productDetails){
//             return res.json({
//                 data:productDetails,
//             });
//         }
//         else{
//             return res.json({
//                 data:null,
//             })
//         }
//     }
//     catch(error){
//         return res.json({
//             data:null,
//         });
//     }
// }

export {getProductDetailsByID};