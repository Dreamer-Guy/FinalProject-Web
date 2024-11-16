import Review from "../Model/Review.js";

const reviewService = {
    async createReview(data) {
        const review = new Review(data);
        return review;
    },
    async saveReview(review) {
        await review.save();
        return review;
    },

    async getReviewsByProductId(id) {
        const reviews = await Review.find({productId:id}).populate({
            path: "user",
            select: "fullName avatar",
        })
        .lean();
        return reviews;
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