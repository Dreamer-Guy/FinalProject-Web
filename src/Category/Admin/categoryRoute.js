import express from "express";
import { getCategoryProperties, getCategories, getCategoryPage } from "./categoryController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";

const adminCategoryRouter = express.Router();
adminCategoryRouter.use(isUserLoginAndRedirect);
adminCategoryRouter.use(isAdmin);

adminCategoryRouter.get("/", getCategoryPage);
adminCategoryRouter.get("/api/get", getCategories);
adminCategoryRouter.get("/:categoryId/properties", getCategoryProperties);

export default adminCategoryRouter;
