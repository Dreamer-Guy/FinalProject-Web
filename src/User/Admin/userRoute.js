import express from "express";
<<<<<<< Updated upstream
import adminUserController from "../../User/Admin/userController.js";
=======
import { getAllUsers,getUsersApi,HandlelockUser,getUserDetail,getAdminProfile, getAdminChangePassword  } from "../../User/Admin/userController.js";
>>>>>>> Stashed changes
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";

const adminUserRouter = express.Router();
adminUserRouter.use(isUserLoginAndRedirect);
adminUserRouter.use(isAdmin);

<<<<<<< Updated upstream
adminUserRouter.get("/", adminUserController.getAllUsers);
adminUserRouter.get("/api/get", adminUserController.getUsersApi);
adminUserRouter.patch("/api/lock/:id", adminUserController.HandlelockUser);
adminUserRouter.get("/api/detail/:id", adminUserController.getUserDetail);
=======
adminUserRouter.get("/", getAllUsers);
adminUserRouter.get("/api/get", getUsersApi);
adminUserRouter.patch("/api/lock/:id", HandlelockUser);
adminUserRouter.get("/api/detail/:id", getUserDetail);
adminUserRouter.get("/profile", getAdminProfile);
adminUserRouter.get("/changePassword", getAdminChangePassword);
>>>>>>> Stashed changes

export default adminUserRouter;