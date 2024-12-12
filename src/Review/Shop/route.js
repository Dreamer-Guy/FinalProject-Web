import express from 'express';  
import { addReview,getUserReviewsPage,getReviewsApi} from './controller.js'
import isUserLogin from '../../middleWare/Authentication/isUserLogin.js';
import isUserLoginAndRedirect from '../../middleWare/Authentication/isUserLoginAndRedirect.js';
const reviewRouter = express.Router();
reviewRouter.post("/add",isUserLogin,addReview);
reviewRouter.get("/myreviews",isUserLoginAndRedirect,getUserReviewsPage);
reviewRouter.get("/get/:productId",getReviewsApi);
export default reviewRouter;