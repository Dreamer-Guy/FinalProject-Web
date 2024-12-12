import express from "express";
import { getCartPage,addCartItem,updateCartItem,deleteCartItem} 
from "./controller.js";
import isUserLogin from "../../middleWare/Authentication/isUserLogin.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";

const cartRouter=express.Router();

cartRouter.get("/get",isUserLoginAndRedirect,getCartPage);
cartRouter.post("/addItems",isUserLogin,addCartItem);
cartRouter.post("/updateItems",isUserLogin,updateCartItem);
cartRouter.post("/deleteItems",isUserLogin,deleteCartItem);
export default cartRouter;