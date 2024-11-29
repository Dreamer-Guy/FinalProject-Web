import {getRevenueInTimePage,getRevenueByTopProductsPage} 
from "./revenueController.js";

import express from "express";

const adminRevenueRouter = express.Router();

adminRevenueRouter.get("/time", getRevenueInTimePage);
adminRevenueRouter.get("/top-products", getRevenueByTopProductsPage);


export default adminRevenueRouter;