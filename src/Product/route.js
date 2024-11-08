import express from "express";
import {fetchAllFilteredProducts,apiGetAllFilteredProducts}
from "./controller.js";

const shoppingProductRouter=express.Router();

shoppingProductRouter.get("/get",fetchAllFilteredProducts);
shoppingProductRouter.get("/api/get",apiGetAllFilteredProducts);
export default shoppingProductRouter;