import express from "express";
import {fetchAllFilteredProducts,apiGetAllFilteredProducts,searchProducts}
from "./controller.js";
import passportLocal from "../middleWare/PassPort.js";


const shoppingProductRouter=express.Router();

shoppingProductRouter.get("/get",fetchAllFilteredProducts);
shoppingProductRouter.get("/api/get",apiGetAllFilteredProducts);
shoppingProductRouter.get("/search",searchProducts);
export default shoppingProductRouter;