
import Order from "../Model/Order.js";
import User from "../Model/User.js";
import suggesterService from "../UtilServices/ElasticSearchService/suggesterService.js";

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
        const savedOrder=await order.save();
        await suggesterService.SynchronizeAfterOrdering(savedOrder);
        return savedOrder;
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
    updateStatusById:async(id,status,checkoutStatus)=>{
        const order=await Order.findByIdAndUpdate(id,{orderStatus:status,checkoutStatus:checkoutStatus},{new:true}).lean();
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
    getOrdersByStatus:async(page=1,rowPerPage=10,status)=>{

        const skip=(page-1)*rowPerPage
        let orders;
        let totalOrders;
        if(!status){
            orders=await Order.find().sort({createdAt:-1}).skip(skip).limit(rowPerPage).lean()
            totalOrders=await Order.countDocuments()
        }else{
            orders=await Order.find({orderStatus:status}).sort({createdAt:-1}).skip(skip).limit(rowPerPage).lean()
            totalOrders=await Order.countDocuments({orderStatus:status})
        }
        const userIds=orders.map(order=>order.userId)
        const users=await User.find({_id:{$in:userIds}}).lean()
        const userMap = users.reduce((acc,user)=>{
            acc[user._id]=user
            return acc
        },{})
        const ordersPoupulate = orders.map(order => ({
            _id: order._id,
            user: userMap[order.userId].fullName,
            productQuantity: order.items.length,
            totalPrice: order.total,
            status: order.orderStatus,
            checkoutStatus: order.checkoutStatus,
            createdAt: order.createdAt,
        }));
        return{
            orders:ordersPoupulate,
            totalOrders
        } 
    },
    getOrderDetailById:async(id)=>{
        const order=await Order.findById(id).lean()
        return order;
    },
    fullfillOrdersByIds:async(ids)=>{
        await ids.forEach(async(id)=>{
            await Order.findByIdAndUpdate(id,{checkoutStatus:"paid"});
        });
    }
};


export default orderService;