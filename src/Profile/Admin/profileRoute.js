import express from "express";
import adminProfileController from "./profileController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";

const adminProfileRouter = express.Router();
adminProfileRouter.use(isUserLoginAndRedirect);
adminProfileRouter.use(isAdmin);

adminProfileRouter.get("/", adminProfileController.getAdminProfile);
adminProfileRouter.get("/changePassword", adminProfileController.getAdminChangePassword);
adminProfileRouter.post("/changePassword", adminProfileController.changePassword);

export default adminProfileRouter;