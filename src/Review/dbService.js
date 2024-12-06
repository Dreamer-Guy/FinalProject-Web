import Review from "../Model/Review.js";

const reviewService = {
    async createReview(data) {
        const review = new Review(data);
        return review;
    },
    async saveReview(review) {
        const saved=await review.save();
        const populatedReview = await Review.findById(saved._id).populate('user').lean();
        return populatedReview;
    },

    async getReviewsByProductId(id,skip=0,limit=0) {
        let reviews;
        if(skip===0 && limit===0){
            reviews = await Review.find({productId:id}).populate({
                path: "user",
                select: "fullName avatar",
            })
            .lean();
        }
        else{
            reviews = await Review.find({productId:id})
            .skip(skip).limit(limit)
            .populate({
                path: "user",
                select: "fullName avatar",
            })
            .lean();
        }
        return reviews;
    },
    async getReviewsByUserId(id){
        const reviews = await Review.find({user:id}).populate('productId','name image')
        return reviews
    },
    async getFilterReviewsByUserId(id,skip,limit){
        const reviews = await Review.find({user:id}).skip(skip).limit(limit).populate('productId','name image').sort({createdAt:-1})
        return reviews
    },
    async getAmountReviewsByUserId(id){
        const total=await Review.countDocuments({user:id})
        return total
    },
    async getReviewById(id) {
        const review = await Review.findById(id);
        return review;
    },
    async updateReview(id, data) {
        await Review.findByIdAndUpdate(id, data);
        const review = await Review.findById(id);
        return review;
    },
    async deleteReview(id) {
        await Review.findByIdAndDelete(id);
        return true;
    },

};

export default reviewService;