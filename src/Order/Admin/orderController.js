import serviceFactory from "../../Factory/serviceFactory.js";
const orderService =serviceFactory.getOrderService();
const ROW_PER_PAGE = 10;
const getOrders= async(req,res)=>{
    try{
        const user =req.user||null;
        if(!user){
            return res.redirect("/login")
        }
        res.render("admin/Order/allOrder")
    }
    catch(e){
        return res.status(500).json({message:"Internal server error"})
    }
}
const getOrdersApi=async(req,res)=>{
try{
    const {page,rowPerPage,status}=req.query;
    let orders;
    let totalOrders;
    if(!status){
        ({orders,totalOrders}=await orderService.getOrdersPoupulate(page,rowPerPage));
    }
    else{
        ({orders,totalOrders}=await orderService.getOrdersByStatus(status,page,rowPerPage));
    }
    if(!orders){
        return res.status(404).json({message:"No orders found"})
    }
    return res.status(200).json({orders,totalOrders})
}
catch(e){
    return res.status(500).json({message:"Internal server error"})
}
}
export {getOrders,getOrdersApi}