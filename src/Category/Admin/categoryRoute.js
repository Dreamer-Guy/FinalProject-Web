import express from "express";
import adminCategoryController from "./categoryController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";

const adminCategoryRouter = express.Router();
adminCategoryRouter.use(isUserLoginAndRedirect);
adminCategoryRouter.use(isAdmin);

adminCategoryRouter.get("/", adminCategoryController.getCategoryPage);
adminCategoryRouter.get("/api/get", adminCategoryController.getCategories);
adminCategoryRouter.get("/:categoryId/properties", adminCategoryController.getCategoryProperties);
adminCategoryRouter.get("/add", adminCategoryController.getAddCategoryPage);
adminCategoryRouter.post("/api/add", adminCategoryController.addCategory);
adminCategoryRouter.get("/:id", adminCategoryController.getCategoryDetail);
adminCategoryRouter.put("/:id", adminCategoryController.updateCategory);
adminCategoryRouter.delete("/properties/:id", adminCategoryController.deleteProperty);
adminCategoryRouter.delete("/:id", adminCategoryController.deleteCategory);
adminCategoryRouter.get("/deleted", adminCategoryController.getDeletedCategories);
adminCategoryRouter.post("/restore/:id", adminCategoryController.restoreCategory);

export default adminCategoryRouter;
