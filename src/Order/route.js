import express from "express";
import { getOrderViewPage,getOrderDetailsPage,createOrder }
from "./controller.js";

const orderRouter = express.Router();  

orderRouter.get("/get", getOrderViewPage);
orderRouter.get("/get/:id", getOrderDetailsPage);
orderRouter.post("/create", createOrder);
export default orderRouter;