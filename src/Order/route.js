import express from "express";
import { getOrderViewPage } from "./controller.js";

const orderRouter = express.Router();  

orderRouter.get("/get", getOrderViewPage);


export default orderRouter;