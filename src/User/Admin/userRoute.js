import express from "express";
import adminUserController from "../../User/Admin/userController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";

const adminUserRouter = express.Router();
adminUserRouter.use(isUserLoginAndRedirect);
adminUserRouter.use(isAdmin);

adminUserRouter.get("/", adminUserController.getAllUsers);
adminUserRouter.get("/api/get", adminUserController.getUsersApi);
adminUserRouter.patch("/api/lock/:id", adminUserController.HandlelockUser);
adminUserRouter.get("/api/detail/:id", adminUserController.getUserDetail);

export default adminUserRouter;