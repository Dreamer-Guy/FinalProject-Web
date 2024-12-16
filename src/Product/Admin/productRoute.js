import express from "express";
import { getProductPage, deleteProduct, getProductsApi } from "./productController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";

const adminProductRouter = express.Router();
adminProductRouter.use(isUserLoginAndRedirect);
adminProductRouter.use(isAdmin);

adminProductRouter.get("/", getProductPage);
adminProductRouter.get("/api/get", getProductsApi);
adminProductRouter.delete("/:id", deleteProduct);

export default adminProductRouter;