import Cart from "../Model/Cart.js";

const cartService={
    getCartByUserId:async (userId) => {
        const cart=await Cart.findOne({userId})
        .populate({
            path:'items.productId',
            match: { isDeleted: false },
            populate:[
                {
                    path:'brand_id',
                    model:'Brand',
                },
                {
                    path:'category_id',
                    model:'Category',
                }
            ],
        }).lean();
        
        if (cart && cart.items) {
            cart.items = cart.items.filter(item => item.productId != null);
        }
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

    deleteCartByUserId:async (userId) => {
        const cart=await Cart.findOneAndDelete({userId});
        return cart;
    },

    coutProductInCart: async (userId) => {
        try {
            const cart = await Cart.findOne({userId})
            .populate({
                path: 'items.productId',
                match: { isDeleted: false }
            }).lean();
            
            if (!cart) return 0;
            return cart.items.filter(item => item.productId != null).length;
        } catch (e) {
            console.log(e);
            return 0;
        }
    }
};


export default cartService;