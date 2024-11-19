import { create } from "migrate-mongo";
import Order from "../Model/Order.js";

const orderService={
    getOrdersByUserId:async(userId)=>{
        const orders=await Order.find({userId:userId}).sort({createdAt:-1}).lean();
        return orders;
    },
    getOrderById:async(id)=>{
        const order=await Order.findById(id).lean();
        return order;
    },
    createOrder:async(orderData)=>{
        const order=new Order(orderData);
        return order;
    },
    saveOrder:async(order)=>{
        return await order.save();
    }
};

export default orderService;