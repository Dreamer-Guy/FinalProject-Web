import express from "express";
import adminProductController from "./productController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";
import upload from "../../Config/multer.js";

const adminProductRouter = express.Router();
adminProductRouter.use(isUserLoginAndRedirect);
adminProductRouter.use(isAdmin);

adminProductRouter.get("/", adminProductController.getProductPage);
adminProductRouter.get("/api/get", adminProductController.getProductsApi);
adminProductRouter.get("/deleted", adminProductController.getDeletedProductsPage);
adminProductRouter.get("/api/deleted", adminProductController.getDeletedProductsApi);
adminProductRouter.get("/add", adminProductController.getAddProductPage);
adminProductRouter.post("/add", adminProductController.addProduct);
adminProductRouter.post("/upload-image", upload.single('image'), adminProductController.uploadProductImage);
adminProductRouter.get("/edit/:id", adminProductController.getEditProductPage);
adminProductRouter.put("/api/update/:id", adminProductController.updateProduct);
adminProductRouter.delete("/api/delete/:id", adminProductController.deleteProduct);
adminProductRouter.post("/api/restore/:id", adminProductController.restoreProduct);
adminProductRouter.get("/:id", adminProductController.getProductDetail);

export default adminProductRouter;

