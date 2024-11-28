import mongoose from "mongoose";


const reviewSchema = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    rating:{
        type: Number,
        default: 0,
    },
    comment:String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Review= mongoose.model("Review", reviewSchema);
export default Review;