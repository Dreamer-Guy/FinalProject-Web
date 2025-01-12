import express from "express";
import shopProductController from "./controller.js";


const shoppingProductRouter=express.Router();

shoppingProductRouter.get("/get",shopProductController.getProductsPage);
shoppingProductRouter.get("/api/get",shopProductController.apiGetProducts);
shoppingProductRouter.get("/api/get-suggested",shopProductController.apiGetSuggestedProducts);

export default shoppingProductRouter;