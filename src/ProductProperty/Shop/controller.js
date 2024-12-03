import serviceFactory from "../../Factory/serviceFactory.js";
import {generateRatingStars} from "../../Utils/viewEngine.js";

const productService=serviceFactory.getProductSerVice();
const reviewService=serviceFactory.getReviewService(); 
const cartService=serviceFactory.getCartService(); 
const productPropertyService=serviceFactory.getProductPropertyService();

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
        console.log(productDetails);
        const product=await productService.getProductById(id);
        const relatedProducts=await productService.getRelatedProductsByProductId(product._id,5)||[];
        const rawReviews=await reviewService.getReviewsByProductId(id);
        //tech-debt:check reviews
        const populatedReviews = rawReviews.map((review)=>populateReview(review));
        const productsInCart = await cartService.coutProductInCart(user?._id||null);
        if(productDetails){
            return res.render('productDetails',{product,
                productDetails:productDetails,
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

export {getProductDetailsPageByID};