import serviceFactory from "../../Factory/serviceFactory.js";
const orderService =serviceFactory.getOrderService();
const userService =serviceFactory.getUserService();
const ROW_PER_PAGE = 10;
const getOrdersPage= async(req,res)=>{
    try{
        const user =req.user||null;
        const status=req.params.status;
        if(!user){
            return res.redirect("/login")
        }
        res.render(`admin/Order/${status}Order`)
    }
    catch(e){
        return res.status(500).json({message:"Internal server error"})
    }
}
const getOrdersApi=async(req,res)=>{
    try{
        const {page,rowPerPage,status}=req.query;
        const {orders,totalOrders}=await orderService.getOrdersByStatus(page,rowPerPage,status);
        if(!orders){
            return res.status(404).json({message:"No orders found"})
        }
        return res.status(200).json({orders,totalOrders})
    }
    catch(e){
        return res.status(500).json({message:"Internal server error"})
    }
}
const getOrdersDetail=async(req,res)=>{
    try{
        const orderId=req.params.id;
        const order=await orderService.getOrderDetailById(orderId);
        if(!order){
            return res.status(404).json({message:"Order not found"})
        }
        const user=await userService.getUserById(order.userId);
        return res.status(200).json(
            {
            orderId:order._id,
            fullName:user.fullName,
            address:`${order.address.street}, ${order.address.city}.`,
            phone:order.address.phone,
            postalCode:order.address.postalCode,
            total:+order.total,
            status:order.orderStatus,
            checkoutStatus:order.checkoutStatus,
            createdAt:order.createdAt,
            items:order.items,
            }
        )
    }
    catch(e){
        return res.status(500).json({message:"Internal server error"})
    }
}
const updateStatus=async(req,res)=>{
    try{
        const user = req.user||null
        if(!user){
            return res.redirect("/login")
        }
        const orderId=req.params.id;
        const {status,checkoutStatus}=req.body;
        const order=await orderService.updateStatusById(orderId,status,checkoutStatus);
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        return res.status(200).json({message:"Status updated successfully"});
    }
    catch(e){
        return res.status(500).json({message:"Internal server error"});
    }
}

const adminOrderController={getOrdersPage,
    getOrdersApi,
    getOrdersDetail,
    updateStatus};
export default adminOrderController;