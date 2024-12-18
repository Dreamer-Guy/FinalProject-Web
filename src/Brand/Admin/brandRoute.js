import express from "express";
import { getBrands, getBrandPage } from "./brandController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";

const adminBrandRouter = express.Router();
adminBrandRouter.use(isUserLoginAndRedirect);
adminBrandRouter.use(isAdmin);

adminBrandRouter.get("/", getBrandPage);
adminBrandRouter.get("/api/get", getBrands);

export default adminBrandRouter;
