import serviceFactory from '../Factory/serviceFactory.js';


const reviewService = serviceFactory.getReviewService();

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
    console.log("fuck")
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(today.getDate()).padStart(2, '0');
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

export {addReview};
