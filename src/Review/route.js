import express from 'express';  
import { addReview,getUserReviews } from './controller.js'

const reviewRouter = express.Router();
reviewRouter.post("/add",addReview);
reviewRouter.get("/myreviews",getUserReviews)
export default reviewRouter;