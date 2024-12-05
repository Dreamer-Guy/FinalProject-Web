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
    save:async(order)=>{
        return await order.save();
    },
    getOrdersInTimeRange:async(startDate,endDate)=>{
        const orders=await Order.find({
            createdAt:{
                $gte:startDate,
                $lt:endDate
            }
        }).lean();
        return orders;
    },
    getAllOrders:async()=>{
        const orders=await Order.find().lean();
        return orders;
    },
    updatePaidOrderById:async(id)=>{
        const order=await Order.findByIdAndUpdate(id,{checkoutStatus:"paid"},{new:true}).lean();
        return order;
    },
    getOrdersByIds:async(ids)=>{
        const orders=await Order.find({
            _id:{
                $in:ids
            }
        }).lean();
        return orders;
    },
    fullfillOrdersByIds:async(ids)=>{
        await ids.forEach(async(id)=>{
            await Order.findByIdAndUpdate(id,{checkoutStatus:"paid"});
        });
    }
};

export default orderService;