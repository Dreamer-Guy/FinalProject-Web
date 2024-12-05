import express from "express";
import {getProductsPage,apiGetProducts}
from "./controller.js";


const shoppingProductRouter=express.Router();

shoppingProductRouter.get("/get",getProductsPage);
shoppingProductRouter.get("/api/get",apiGetProducts);

export default shoppingProductRouter;