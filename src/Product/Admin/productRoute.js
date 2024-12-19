import express from "express";
import { getProductPage, deleteProduct, getProductsApi, getProductDetail, getAddProductPage, addProduct, uploadProductImage, getEditProductPage, updateProduct } from "./productController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";
import upload from "../../Config/multer.js";

const adminProductRouter = express.Router();
adminProductRouter.use(isUserLoginAndRedirect);
adminProductRouter.use(isAdmin);

adminProductRouter.get("/", getProductPage);
adminProductRouter.get("/api/get", getProductsApi);
adminProductRouter.get("/add", getAddProductPage);
adminProductRouter.post("/add", addProduct);
adminProductRouter.get("/:id", getProductDetail);
adminProductRouter.delete("/api/delete/:id", deleteProduct);
adminProductRouter.post("/upload-image", upload.single('image'), uploadProductImage);
adminProductRouter.get("/edit/:id", getEditProductPage);
adminProductRouter.put("/api/update/:id", updateProduct);

export default adminProductRouter;