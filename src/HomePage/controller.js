import serviceFactory from "../Factory/serviceFactory.js";
import express from "express";

const productService = serviceFactory.getProductSerVice();
const cartService = serviceFactory.getCartService();

const TOP_PRODUCT_COUNT=4;

const populateProduct=(product)=>{
    const populatedProduct={
        productId: product._id,
        type: product.type,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        brand: product.brand,
        totalStock: product.totalStock,
        image: product.image,
        rating: product.rating,
    };
    return populatedProduct;
}

const homeRouter=express.Router();

homeRouter.get("/",async(req,res)=>{
    const user=req.user||null;
    const products=await productService.getProducts([],[],null,null);
    const populatedProducts = products.map((product) => (populateProduct(product)));
    const topProducts=await productService.getTopProducts(TOP_PRODUCT_COUNT);
    const populatedTopProducts = topProducts.map((product) => (populateProduct(product)));
    const productsInCart = await cartService.coutProductInCart(user?user._id:null);
    res.render("home",{
        user,
        products:populatedProducts,
        topProducts:populatedTopProducts,
        cartNumber:productsInCart
    });
});

export default homeRouter;