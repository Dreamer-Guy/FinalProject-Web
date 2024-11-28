import { get } from "mongoose";
import serviceFactory from "../Factory/serviceFactory.js";

const orderService=serviceFactory.getOrderService();
const cartService=serviceFactory.getCartService();
const addressService=serviceFactory.getAddressService();

const ROW_PER_PAGE=2;

const formatDate=(date)=>{
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}
const populateOrder=(order)=>{
    const populatedOrder={
        ...order,
        createdAt:formatDate(order.createdAt),
    };
    return populatedOrder;
}


const getOrderItems=(items)=>{
    return items.map(item=>({
        productId:item.productId._id.toString(),
        name:item.productId.name,
        type:item.productId.type,
        brand:item.productId.brand,
        image:item.productId.image,
        price:item.productId.salePrice>0?item.productId.salePrice:item.productId.price,
        quantity:item.quantity,
    }));
};

const calculateOrderTotal=(items)=>{
    return items.reduce((total,item)=>{
        total+=(item.productId.salePrice>0?item.productId.salePrice:item.productId.price)*item.quantity;
        return total;
    },0);
};

const getOrderData=(user,cart,address)=>{
    const orderData={
        userId:user._id,
        items:getOrderItems(cart.items),
        address:{
            fullName:user.fullName,
            street:address.street,
            city:address.city,
            postalCode:address.postalCode,
            phone:address.phone,
        },
        total:calculateOrderTotal(cart.items),
        orderStatus:"pending",
        checkoutStatus:"unpaid",
    };
    return orderData;
};

const getOrderViewPage=async(req,res)=>{
    const user=req.user||{_id:"673acf13fbb04dec26fc84c6"};
    const productsInCart = await cartService.coutProductInCart(user._id);
    const rawOrders=await orderService.getOrdersByUserId(user._id);
    const orders=rawOrders.map(order=>populateOrder(order));
    const totalOrders=orders.length;
    return res.render("order",{
        user:user,
        orders:orders,
        cartNumber: productsInCart,
    });
}

const getOrderDetailsPage=async(req,res)=>{
    const user=req.user||{_id:"673acf13fbb04dec26fc84c6"};
    const productsInCart = await cartService.coutProductInCart(user._id);
    const orderId=req.params.id;
    const order=await orderService.getOrderById(orderId);
    const populatedOrder=populateOrder(order);
    return res.render("orderDetails",{
        user:user,
        order:populatedOrder,
        cartNumber: productsInCart,
    });
};

const createOrder=async(req,res)=>{
    const user=req.user||{_id:"673acf13fbb04dec26fc84c6"};
    const cart=await cartService.getCartByUserId(user._id);
    const address=await addressService.getAddressByUserId(user._id);
    if(!address || !cart){
        return res.status(400).json({message:"Resource not found"});
    }
    const orderData=getOrderData(user,cart,address);
    const order=await orderService.createOrder(orderData);
    await orderService.save(order);
    return res.json(order);
};
export {getOrderViewPage,getOrderDetailsPage,createOrder};