import express from "express";
import { getOrderViewPage,getOrderDetailsPage }
from "./controller.js";

const orderRouter = express.Router();  

orderRouter.get("/get", getOrderViewPage);
orderRouter.get("/get/:id", getOrderDetailsPage);
export default orderRouter;