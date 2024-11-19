import serviceFactory from "../Factory/serviceFactory.js";

const orderService=serviceFactory.getOrderService();


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

const getOrderViewPage=async(req,res)=>{
    const user=req.user||{_id:"673acf13fbb04dec26fc84c6"};
    const rawOrders=await orderService.getOrdersByUserId(user._id);
    const orders=rawOrders.map(order=>populateOrder(order));
    const totalOrders=orders.length;
    return res.render("order",{
        user:user,
        orders:orders,
    });
}

const getOrderDetailsPage=async(req,res)=>{
    const user=req.user||{_id:"673acf13fbb04dec26fc84c6"};
    const orderId=req.params.id;
    const order=await orderService.getOrderById(orderId);
    const populatedOrder=populateOrder(order);
    return res.render("orderDetails",{
        user:user,
        order:populatedOrder,
    });
};
export {getOrderViewPage,getOrderDetailsPage};