import express from "express";
import{getOrdersPage,getOrdersApi,getOrdersDetail,updateStatus} from "./orderController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";
const adminOrderRouter = express.Router();
adminOrderRouter.use(isUserLoginAndRedirect);
adminOrderRouter.use(isAdmin);

adminOrderRouter.get("/:status",getOrdersPage);
adminOrderRouter.get("/api/get",getOrdersApi);
adminOrderRouter.get("/api/detail/:id",getOrdersDetail);
adminOrderRouter.patch("/api/updateStatus/:id",updateStatus);

export default adminOrderRouter;
