import express from "express";
import { getProductPage, deleteProduct, getProductsApi, getProductDetail, getAddProductPage, addProduct } from "./productController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";

const adminProductRouter = express.Router();
adminProductRouter.use(isUserLoginAndRedirect);
adminProductRouter.use(isAdmin);

adminProductRouter.get("/", getProductPage);
adminProductRouter.get("/api/get", getProductsApi);
adminProductRouter.get("/add", getAddProductPage);
adminProductRouter.post("/add", addProduct);
adminProductRouter.get("/:id", getProductDetail);
adminProductRouter.delete("/api/delete/:id", deleteProduct);

export default adminProductRouter;