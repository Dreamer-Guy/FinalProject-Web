import express from 'express';  
import { addReview } from './controller.js';

const reviewRouter = express.Router();
reviewRouter.post("/add",addReview);
export default reviewRouter;