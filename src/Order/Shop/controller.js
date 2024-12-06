import { get } from "mongoose";
import serviceFactory from "../../Factory/serviceFactory.js";
import Category from "../../Model/Category.js";
import productService from "../../Product/dbService.js";

const BAD_REQUEST_STATUS=400;
const OK_STATUS=200;

const DEFAULT_PAGE=1;
const DEFAULT_ORDER_LIMIT=6;


const orderService=serviceFactory.getOrderService();
const cartService=serviceFactory.getCartService();
const addressService=serviceFactory.getAddressService();

const ROW_PER_PAGE=2;

const formatDate=(date)=>{
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return formattedDate;
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
        category:item.productId.category_id.name,
        brand:item.productId.brand_id.name,
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
    const user=req.user||null;
    const productsInCart = await cartService.coutProductInCart(user._id);
    const rawOrders=await orderService.getOrdersByUserId(user._id);
    const totalOrders=rawOrders.length;
    const orders=rawOrders.slice(0,DEFAULT_ORDER_LIMIT).map(order=>populateOrder(order));
    return res.render("order",{
        user:user,
        orders:orders,
        totalOrders:totalOrders,
        rowPerPage:DEFAULT_ORDER_LIMIT,
        cartNumber: productsInCart,
    });
}

const getOrdersApi=async(req,res)=>{
    const user=req.user||null;
    const page=req.query.page||DEFAULT_PAGE;
    const limit=req.query.limit||DEFAULT_ORDER_LIMIT;
    const rawOrders=await orderService.getOrdersByUserId(user._id);
    const totalOrders=rawOrders.length;
    const orders=rawOrders.slice((page-1)*limit,page*limit).map(order=>populateOrder(order));
    return res.send({
        orders:orders,
        totalOrders:totalOrders,
        rowPerPage:limit,
    });
};

const getOrderDetailsPage=async(req,res)=>{
    const user=req.user||null;
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
    const user=req.user||null;
    const cart=await cartService.getCartByUserId(user._id);
    const address=await addressService.getAddressByUserId(user._id);
    if(!address || !cart){
        return res.status(BAD_REQUEST_STATUS).json({message:"Resource not found"});
    }
    const orderData=getOrderData(user,cart,address);
    const order=await orderService.createOrder(orderData);
    await productService.updateQuantityAfterMakingOrder(order);
    const savedOrder=await orderService.save(order);
    await cartService.deleteCartByUserId(user._id);
    return res.status(OK_STATUS).send({
        order:savedOrder,
    });
};
export {getOrderViewPage,getOrderDetailsPage,createOrder,getOrdersApi};