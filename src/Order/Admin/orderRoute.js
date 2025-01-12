import express from "express";
import adminOrderController from "./orderController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";
const adminOrderRouter = express.Router();
adminOrderRouter.use(isUserLoginAndRedirect);
adminOrderRouter.use(isAdmin);

adminOrderRouter.get("/:status",adminOrderController.getOrdersPage);
adminOrderRouter.get("/api/get",adminOrderController.getOrdersApi);
adminOrderRouter.get("/api/detail/:id",adminOrderController.getOrdersDetail);
adminOrderRouter.patch("/api/updateStatus/:id",adminOrderController.updateStatus);

export default adminOrderRouter;
