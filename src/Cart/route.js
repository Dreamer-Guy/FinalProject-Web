import express from "express";
import { getCartPage,addCartItems,updateCartItems,deleteCartItems} 
from "./controller.js";
const cartRouter=express.Router();

cartRouter.get("/get",getCartPage);
cartRouter.post("/addItems",addCartItems);
cartRouter.post("/updateItems",updateCartItems);
cartRouter.post("/deleteItems",deleteCartItems);
export default cartRouter;