import {getRevenueInTimePage,getRevenueByTopProductsPage} 
from "./revenueController.js";

import express from "express";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";
import isAdmin from "../../middleWare/Authorization/isAdmin.js";


const adminRevenueRouter = express.Router();
adminRevenueRouter.use(isUserLoginAndRedirect);
adminRevenueRouter.use(isAdmin);

adminRevenueRouter.get("/time", getRevenueInTimePage);
adminRevenueRouter.get("/top-products", getRevenueByTopProductsPage);


export default adminRevenueRouter;