import serviceFactory from '../../Factory/serviceFactory.js';
const reviewService = serviceFactory.getReviewService();
const userService =serviceFactory.getUserService();

const getReviewProperties = (req) => {
    const {productId,user,rating,comment} = req.body;
    return {productId,user,rating,comment};
};

const isValid = ({productId,user,rating,comment}) => {
    //tech-debt:productId and user is valid?? but it is better to check in frontend
    const missData=productId && user && rating && comment;
    const ratingInRange =!isNaN(rating) && rating >= 0 && rating <= 5;
    return missData && ratingInRange;
};
const getFormatedDate=(date)=>{
    const d = new Date(date); 
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); 
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
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
        createdAt:getFormatedDate(review.createdAt),
    };
    return populatedReview; 
};



const addReview = async (req, res) => {
    try {
        const{productId,user,rating,comment} = getReviewProperties(req);
        if(!isValid({productId,user,rating,comment})){
            return res.status(400).json({message:"Invalid data"});
        }
        const review = await reviewService.createReview({productId,user,rating:Number(rating),comment});
        await reviewService.saveReview(review);
        const rawReviews=await reviewService.getReviewsByProductId(productId);
        //tech-debt:check reviews
        const populatedReviews = rawReviews.map((review)=>populateReview(review));
        res.status(201).json(review);
    } 
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const populateUserReview =(review)=>{
    const populateReview ={
        reviewId:review._id,
        product:{
            _id:review.productId._id,
            name:review.productId.name,
            image:review.productId.image
        },
        rating:review.rating,
        comment:review.comment,
        createdAt:getFormatedDate(review.createdAt)
    }
    return populateReview
}
const getUserReviews=async(req,res)=>{
    try{
        const page =parseInt(req.query.page)||1
        const limit =5
        const skip= (page-1)*limit
        const userId =req.user._id
        const user =await userService.getUserById(userId)
        const rawReviews = await reviewService.getFilterReviewsByUserId(userId,skip,limit)
        const totalReview =await reviewService.getAmountReviewsByUserId(userId)
        const totalPages = Math.ceil(totalReview/limit)
        const reviews=rawReviews.map(review=>populateUserReview(review))
        
        res.render('myReviews',{user,reviews,page,totalPages})
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
}

export {addReview,getUserReviews};
