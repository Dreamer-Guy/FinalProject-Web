import express from "express";
import { getBrands, getBrandPage, addBrand, getAddBrandPage, updateBrand } from "./brandController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";

const adminBrandRouter = express.Router();
adminBrandRouter.use(isUserLoginAndRedirect);
adminBrandRouter.use(isAdmin);

adminBrandRouter.get("/", getBrandPage);
adminBrandRouter.get("/api/get", getBrands);
adminBrandRouter.get("/add", getAddBrandPage);
adminBrandRouter.post("/api/add", addBrand);
adminBrandRouter.put("/api/update/:id", updateBrand);

export default adminBrandRouter;
