import serviceFactory from "../../Factory/serviceFactory.js";
import checkNumber from "../../utils/checkNumber.js";
import formatNumber from "../../utils/formatNumber.js";

const cartService=serviceFactory.getCartService();
const productService=serviceFactory.getProductSerVice();

const OK_STATUS=200;
const BAD_REQUEST_STATUS=400;
const INTERNAL_SERVER_ERROR_STATUS=500;

const formatCart=(cart)=>{
    return{
        ...cart,
        items:cart.items.map(item=>({
            ...item,
            productId:{
                ...item.productId,
                price:formatNumber.decimal(item.productId.price),
                salePrice:formatNumber.decimal(item.productId.salePrice),
            }
        }))
    };
}

const isValidQuantityToUpdate=(cart,productId,quantity)=>{
    const index=cart.items.findIndex(item=>item.productId._id.toString()===productId);
    if(index===-1){
        return "Not found product";
    }
    const availableStock=cart.items[index].productId.totalStock;
    if(availableStock<quantity){
        return "Not enough stock";
    }
    if(quantity<=0){
        return "Invalid quantity";
    }
    return null;
};
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

const addCartItem=async(req,res)=>{
    try{
        const user=req.user;
        if(!isAddCartItemsValid(req)){
            return res.status(BAD_REQUEST_STATUS).json({message:"Invalid request"});
        };
        const {productId,quantity}=req.body;
        const product=await productService.getProductById(productId);
        if(!product || product.isDeleted){
            return res.status(BAD_REQUEST_STATUS).json({message:"Product not available"});
        };
        if(product.totalStock<quantity){
            return res.status(BAD_REQUEST_STATUS).json({message:"Not enough stock"});
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

const updateCartItem=async(req,res)=>{
    try{
        const user=req.user;
        if(!isUpdateCartItemsValid(req)){
            return res.status(BAD_REQUEST_STATUS).json({message:"Invalid request"});
        };
        const {productId,quantity}=req.body;
        const product=await productService.getProductById(productId);
        if(!product){
            return res.status(BAD_REQUEST_STATUS).json({message:"Invalid product id"});
        }
        const cart=await cartService.getCartByUserId(user._id);
        const errorInvalidQuantity=isValidQuantityToUpdate(cart,productId,quantity);
        if(errorInvalidQuantity){
            return res.status(BAD_REQUEST_STATUS).json({message:errorInvalidQuantity});
        };
        const items=cart.items.map(item=>{
            if(item.productId._id.toString()===productId){
                item.quantity=Number(quantity);
            }
            return item;
        });
        const newCart=await cartService.updateCart(user._id,items);
        return res.send({
            cart:newCart,
        });
    }
    catch(e){
        return res.status(INTERNAL_SERVER_ERROR_STATUS).json({message:e.message});
    }
}

const deleteCartItem=async (req,res) => {
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
    console.log(cart.items);
    const totalPrice=cart.items.reduce((total,item)=>{
        return total+item.productId.price*item.quantity;
    },0);
    const productsInCart = await cartService.coutProductInCart(user._id);
    res.render('cart',{
        user,
        cart:formatCart(cart),
        cartNumber: productsInCart,
        totalPrice: formatNumber.decimal(totalPrice),
    });
};

const shopCartControler={
    getCartPage,
    addCartItem,
    updateCartItem,
    deleteCartItem,
    deleteCart
}



export default shopCartControler;