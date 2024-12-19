import express from "express";
import { getCategoryProperties, getCategories, getCategoryPage, addCategory, getAddCategoryPage, getCategoryDetail, updateCategory, deleteProperty } from "./categoryController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";

const adminCategoryRouter = express.Router();
adminCategoryRouter.use(isUserLoginAndRedirect);
adminCategoryRouter.use(isAdmin);

adminCategoryRouter.get("/", getCategoryPage);
adminCategoryRouter.get("/api/get", getCategories);
adminCategoryRouter.get("/:categoryId/properties", getCategoryProperties);
adminCategoryRouter.get("/add", getAddCategoryPage);
adminCategoryRouter.post("/api/add", addCategory);
adminCategoryRouter.get("/:id", getCategoryDetail);
adminCategoryRouter.put("/:id", updateCategory);
adminCategoryRouter.delete("/properties/:id", deleteProperty);

export default adminCategoryRouter;
