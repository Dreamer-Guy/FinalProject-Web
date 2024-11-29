import express from "express";
import { getCartPage,addCartItems,updateCartItems,deleteCartItems} 
from "./controller.js";
import isUserLogin from "../../middleWare/isUserLogin.js";

const cartRouter=express.Router();

cartRouter.get("/get",getCartPage);
cartRouter.post("/addItems",isUserLogin,addCartItems);
cartRouter.post("/updateItems",isUserLogin,updateCartItems);
cartRouter.post("/deleteItems",isUserLogin,deleteCartItems);
export default cartRouter;