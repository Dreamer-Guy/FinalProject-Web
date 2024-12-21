import express from "express";
import {getProductsPage,apiGetProducts,apiGetSuggestedProducts}
from "./controller.js";


const shoppingProductRouter=express.Router();

shoppingProductRouter.get("/get",getProductsPage);
shoppingProductRouter.get("/api/get",apiGetProducts);
shoppingProductRouter.get("/api/get-suggested",apiGetSuggestedProducts);

export default shoppingProductRouter;