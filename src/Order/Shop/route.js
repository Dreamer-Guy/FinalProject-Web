import express from "express";
import shopOrderController from "./controller.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isUserLogin from "../../middleWare/Authentication/isUserLogin.js";
const orderRouter = express.Router();  

orderRouter.get("/get/api", isUserLogin,shopOrderController.getOrdersApi);
orderRouter.get("/get",isUserLoginAndRedirect, shopOrderController.getOrderViewPage);
orderRouter.get("/get/:id",isUserLoginAndRedirect ,shopOrderController.getOrderDetailsPage);
orderRouter.post("/create", isUserLogin,shopOrderController.createOrder);
export default orderRouter;