import express from "express";
import shopCartControler from "./controller.js";
import isUserLogin from "../../middleWare/Authentication/isUserLogin.js";
import isUserLoginAndRedirect from "../../middleWare/Authentication/isUserLoginAndRedirect.js";

const cartRouter=express.Router();

cartRouter.get("/get",isUserLoginAndRedirect,shopCartControler.getCartPage);
cartRouter.post("/addItems",isUserLogin,shopCartControler.addCartItem);
cartRouter.post("/updateItems",isUserLogin,shopCartControler.updateCartItem);
cartRouter.post("/deleteItems",isUserLogin,shopCartControler.deleteCartItem);
export default cartRouter;