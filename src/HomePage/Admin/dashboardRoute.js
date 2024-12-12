import { getDashBoardPage } 
from "./dashboardController.js";
import express from "express";

import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";

const adminDashBoardRouter = express.Router();
adminDashBoardRouter.use(isUserLoginAndRedirect);
adminDashBoardRouter.use(isAdmin);

adminDashBoardRouter.get("/", getDashBoardPage);

export default adminDashBoardRouter;