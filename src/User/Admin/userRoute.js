import express from "express";
import { getAllUsers,getUsersApi,HandlelockUser,getUserDetail  } from "../../User/Admin/userController.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";

const adminUserRouter = express.Router();
adminUserRouter.use(isUserLoginAndRedirect);
adminUserRouter.use(isAdmin);

adminUserRouter.get("/", getAllUsers);
adminUserRouter.get("/api/get", getUsersApi);
adminUserRouter.patch("/api/lock/:id", HandlelockUser);
adminUserRouter.get("/api/detail/:id", getUserDetail);

export default adminUserRouter;