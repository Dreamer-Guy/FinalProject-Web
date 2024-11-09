import serviceFactory from "../Factory/serviceFactory.js";
import express from "express";

const productService = serviceFactory.getProductSerVice();

const TOP_PRODUCT_COUNT=4;

const homeRouter=express.Router();

homeRouter.get("/",async(req,res)=>{
    const products=await productService.getProducts([],[],null,null);
    const topProducts=await productService.getTopProducts(TOP_PRODUCT_COUNT);
    res.render("home",{
        products,
        topProducts});
});

export default homeRouter;