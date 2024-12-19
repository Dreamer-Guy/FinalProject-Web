import express from "express";
import{getOrders,getOrdersApi} from "./orderController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";
const adminOrderRouter = express.Router();
adminOrderRouter.use(isUserLoginAndRedirect);
adminOrderRouter.use(isAdmin);

adminOrderRouter.get("/",getOrders);
adminOrderRouter.get("/api/get",getOrdersApi);

export default adminOrderRouter;
