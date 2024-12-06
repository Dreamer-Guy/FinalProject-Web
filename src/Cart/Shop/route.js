import express from "express";
import { getCartPage,addCartItem,updateCartItem,deleteCartItem} 
from "./controller.js";
import isUserLogin from "../../middleWare/isUserLogin.js";

const cartRouter=express.Router();

cartRouter.get("/get",getCartPage);
cartRouter.post("/addItems",isUserLogin,addCartItem);
cartRouter.post("/updateItems",isUserLogin,updateCartItem);
cartRouter.post("/deleteItems",isUserLogin,deleteCartItem);
export default cartRouter;