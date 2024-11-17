import Cart from "../Model/Cart.js";

const cartService={
    getCartByUserId:async (userId) => {
        const cart=await Cart.findOne({userId}).populate('items.productId').lean();
        return cart;
    },

    createCart:async (userId,items) => {
        const cart=new Cart({userId,items});
        return cart;
    },
    
    saveCart:async (cart) => {
        const savedCart=await cart.save();
        return savedCart;
    },

    updateCart:async (userId,items) => {
        const cart=await Cart.findOneAndUpdate({userId},{items},{new:true}).populate('items.productId');
        return cart;
    },

    deleteCart:async (userId) => {
        const cart=await Cart.findOneAndDelete({userId});
        return cart;
    }

    
};


export default cartService;