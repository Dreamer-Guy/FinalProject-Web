import { json } from "express";
import serviceFactory from "../Factory/serviceFactory.js";
import checkNumber from "../utils/checkNumber.js";

const cartService=serviceFactory.getCartService();
const productService=serviceFactory.getProductSerVice();

const OK_STATUS=200;
const BAD_REQUEST_STATUS=400;
const INTERNAL_SERVER_ERROR_STATUS=500;
const deleteCart=async (req,res) => {
    try{
        const user=req.user;
        await cartService.deleteCart(user._id);
        return res.status(OK_STATUS).json({message:"Cart deleted successfully"});
    }
    catch(e){
        return res.status(INTERNAL_SERVER_ERROR_STATUS).send({
            message:e.message,
        })
    }
            
};

const isAddCartItemsValid=(req)=>{
    const {productId,quantity}=req.body;
    if(!productId||!quantity){
        return false;
    }
    if(!checkNumber.isPositiveInteger(quantity)){
        return false;
    }
    return true;
};

const isUpdateCartItemsValid=(req)=>{
    const {productId,quantity}=req.body;
    if(!productId||!quantity){
        return false;
    }
    if(!checkNumber.isPositiveInteger(quantity)){
        return false;
    }
    return true;
};

const isDeleteCartItemsValid=(req)=>{
    const {productId}=req.body;
    if(!productId){
        return false;
    }
    return true;
};

const addCartItems=async(req,res)=>{
    try{
        const user=req.user;
        if(!isAddCartItemsValid(req)){
            return res.status(BAD_REQUEST_STATUS).json({message:"Invalid request"});
        };
        const {productId,quantity}=req.body;
        if(!await productService.getProductById(productId)){
            return res.status(BAD_REQUEST_STATUS).json({message:"Invalid product id"});
        };
        let cart=await cartService.getCartByUserId(user._id);
        if(!cart){
            cart=await cartService.createCart(user._id,[]);
            await cartService.saveCart(cart);
        }
        const indexItem=cart.items.findIndex(item=>item.productId._id.toString()===productId);
        if(indexItem===-1){
            cart.items.push({productId,quantity});
        }
        else{
            cart.items[indexItem].quantity+=quantity;
        }
        await cartService.updateCart(user._id,cart.items);
        return res.status(OK_STATUS)
        .send({
            message:"Item added to cart successfully",
            cartNumber:cart.items.length,});
    }
    catch(e){
        return res.status(INTERNAL_SERVER_ERROR_STATUS).json({message:e.message});
    }
};

const updateCartItems=async(req,res)=>{
    try{
        const user=req.user;
        if(!isUpdateCartItemsValid(req)){
            return res.status(BAD_REQUEST_STATUS).json({message:"Invalid request"});
        };
        const {productId,quantity}=req.body;
        const cart=await cartService.getCartByUserId(user._id);
        const items=cart.items.map(item=>{
            if(item.productId._id.toString()===productId){
                item.quantity=Number(quantity);
            }
            return item;
        });
        await cartService.updateCart(user._id,items);
        return res.json({message:"Cart updated successfully"});
    }
    catch(e){
        return res.status(INTERNAL_SERVER_ERROR_STATUS).json({message:e.message});
    }
}

const deleteCartItems=async (req,res) => {
    try{
        const user=req.user;
        if(!isDeleteCartItemsValid(req)){
            return res.status(BAD_REQUEST_STATUS).json({message:"Invalid request"});
        }
        const {productId}=req.body;
        const cart=await cartService.getCartByUserId(user._id);
        const items=cart.items.filter(item => item.productId._id.toString()!==productId);
        await cartService.updateCart(user._id,items);
        return res.json({message:"Item deleted from cart successfully"});
    }
    catch(e){
        return res.status(500).json({message:e.message});
    }
}


const getCartPage=async (req,res) => {
    const user=req.user;
    if(!user){
        return res.redirect('/user/login');
    }
    const cart=await cartService.getCartByUserId(user._id)||{userId:user._id,items:[]}; 
    const productsInCart = await cartService.coutProductInCart(user._id);
    res.render('cart',{
        user,
        cart,
        cartNumber: productsInCart
    });
};



export {getCartPage,addCartItems,updateCartItems,deleteCartItems};