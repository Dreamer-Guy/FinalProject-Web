import express from 'express';  
import { addReview,getUserReviewsPage,getReviewsApi} from './controller.js'
import isUserLogin from '../../middleWare/isUserLogin.js';
const reviewRouter = express.Router();
reviewRouter.post("/add",addReview);
reviewRouter.get("/myreviews",isUserLogin,getUserReviewsPage);
reviewRouter.get("/get/:productId",getReviewsApi);
export default reviewRouter;