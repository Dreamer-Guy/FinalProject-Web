import express from "express";
import { getProductDetailsByID } from "./controller.js";

const shoppingProductDetailsRouter=express.Router();

shoppingProductDetailsRouter.get("/get/:id",getProductDetailsByID);

export default shoppingProductDetailsRouter;