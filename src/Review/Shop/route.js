import express from 'express';  
import shopReviewController from './controller.js'
import isUserLogin from '../../middleWare/Authentication/isUserLogin.js';
import isUserLoginAndRedirect from '../../middleWare/Authentication/isUserLoginAndRedirect.js';
const reviewRouter = express.Router();
reviewRouter.post("/add",isUserLogin,shopReviewController.addReview);
reviewRouter.get("/myreviews",isUserLoginAndRedirect,shopReviewController.getUserReviewsPage);
reviewRouter.get("/get/:productId",shopReviewController.getReviewsApi);
export default reviewRouter;