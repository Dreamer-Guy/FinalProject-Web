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
    getOrdersPopulate:async(page=1,rowPerPage=10)=>{
        const skip=(page-1)*rowPerPage
        const orders=await Order.find()
        .populate("userId")
        .skip(skip)
        .limit(rowPerPage)
        .lean();
        const totalOrders=await Order.countDocuments();
        const ordersPopulate = orders.map(order => ({
            _id: order._id,
            user: order.userId.fullName,
            productQuantity: order.items.length,
            totalPrice: order.total,
            status: order.status,
            checkoutStatus: order.checkoutStatus,
            createdAt: order.createdAt,
        }));

        return {
            orders: ordersPopulate,
            totalOrders
        };
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
    getOrdersByStatus:async(status,page=1,rowPerPage=10)=>{
        const skip=(page-1)*rowPerPage
        const orders=await Order.find({status:status})
        .populate("userId")
        .skip(skip)
        .limit(rowPerPage)
        .lean()
        const totalOrders=await Order.countDocuments({status:status})
        const ordersPoupulate = orders.map(order => ({
            _id: order._id,
            user: order.userId.fullName,
            productQuantity: order.items.length,
            totalPrice: order.total,
            status: order.status,
            checkoutStatus: order.checkoutStatus,
            createdAt: order.createdAt,
        }));
           
        return{
            orders:ordersPoupulate,
            totalOrders
        } 
    },
    fullfillOrdersByIds:async(ids)=>{
        await ids.forEach(async(id)=>{
            await Order.findByIdAndUpdate(id,{checkoutStatus:"paid"});
        });
    }
};

export default orderService;