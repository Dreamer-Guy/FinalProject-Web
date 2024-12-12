import express from "express";
import { getOrderViewPage,getOrderDetailsPage,createOrder,getOrdersApi }
from "./controller.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isUserLogin from "../../middleWare/Authentication/isUserLogin.js";
const orderRouter = express.Router();  

orderRouter.get("/get/api", isUserLogin,getOrdersApi);
orderRouter.get("/get",isUserLoginAndRedirect, getOrderViewPage);
orderRouter.get("/get/:id",isUserLoginAndRedirect ,getOrderDetailsPage);
orderRouter.post("/create", isUserLogin,createOrder);
export default orderRouter;