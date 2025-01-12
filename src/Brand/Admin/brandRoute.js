import express from "express";
import adminBrandController from "./brandController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";

const adminBrandRouter = express.Router();
adminBrandRouter.use(isUserLoginAndRedirect);
adminBrandRouter.use(isAdmin);

adminBrandRouter.get("/", adminBrandController.getBrandPage);
adminBrandRouter.get("/api/get", adminBrandController.getBrands);
adminBrandRouter.get("/add", adminBrandController.getAddBrandPage);
adminBrandRouter.post("/api/add", adminBrandController.addBrand);
adminBrandRouter.put("/api/update/:id", adminBrandController.updateBrand);
adminBrandRouter.delete("/api/delete/:id", adminBrandController.deleteBrand);

export default adminBrandRouter;
