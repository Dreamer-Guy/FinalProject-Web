import express from "express";
import { getOrderViewPage,getOrderDetailsPage,createOrder,getOrdersApi }
from "./controller.js";

const orderRouter = express.Router();  

orderRouter.get("/get/api", getOrdersApi);
orderRouter.get("/get", getOrderViewPage);
orderRouter.get("/get/:id", getOrderDetailsPage);
orderRouter.post("/create", createOrder);
export default orderRouter;