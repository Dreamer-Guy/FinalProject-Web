import serviceFactory from "../../Factory/serviceFactory.js";
import {generateRatingStars} from "../../utils/viewEngine.js";

const productService=serviceFactory.getProductSerVice();
const reviewService=serviceFactory.getReviewService(); 
const cartService=serviceFactory.getCartService(); 
const productPropertyService=serviceFactory.getProductPropertyService();
const imagesProductService=serviceFactory.getImagesProductService();

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


const getProductDetailsPageByID=async(req,res)=>{
    try{
        const user=req.user||null;
        const {id}=req.params;
        const productDetails=await productPropertyService.getProductPropertiesByProductId(id)||[
            {
                property_id:{
                    name:"No details",
                },
                value:"No details",
            }
        ];
        const product=await productService.getProductById(id);
        const COUNT_TOP_PRODUCTS=5;
        const relatedProducts=await productService.getRelatedProductsByProductId(product._id,COUNT_TOP_PRODUCTS)||[];
        const rawReviews=await reviewService.getReviewsByProductId(id);
        const LIMIT_REVIEWS=4;
        const limitdReviews = rawReviews.slice(0,LIMIT_REVIEWS).map((review)=>populateReview(review));
        const productsInCart = await cartService.coutProductInCart(user?._id||null);
        const alternativeImages=await imagesProductService.getAllAlternativeImagesOfProduct(id);
        if(productDetails){
            return res.render('productDetails',{
                product,
                productDetails:productDetails,
                relatedProducts,
                reviews:rawReviews,
                showingReviews:limitdReviews,
                totalReviews:rawReviews.length,
                reviewsPerPage:LIMIT_REVIEWS,
                user:user,
                generateRatingStars,
                cartNumber:productsInCart,
                alternativeImages,
            }
        );
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

export {getProductDetailsPageByID};