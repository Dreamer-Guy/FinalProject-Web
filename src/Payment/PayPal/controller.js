import paypal from "../../Config/paypal.js";
import serviceFactory from "../../Factory/serviceFactory.js";
import axios from "axios";
import paypalService from "./service.js";


const BAD_REQUEST_STATUS=400;
const OK_STATUS=200;

const CURRENCY="USD";

const orderService=serviceFactory.getOrderService();

const formatItems=(items)=>{
    return items.map(item=>({
        name:item.name,
        quantity:item.quantity,
        unit_amount:{
            currency_code:CURRENCY,
            value:item.price,
        },
    }));
}

const create_order_json=(order)=>{
    const items=formatItems(order.items);
    const payment={
        intent:"CAPTURE",
        purchase_units:[{
            items:items,
            amount:{
                currency_code:CURRENCY,
                value:order.total,
                breakdown:{
                    item_total:{
                        currency_code:CURRENCY,
                        value:order.total,
                    },
                }
            }
        }],
        application_context:{
            return_url:process.env.BASE_URL+"/payment/paypal/success-pay",
            cancel_url:process.env.BASE_URL+"/payment/paypal/cancel",
            user_action:"PAY_NOW",
            brand_name:"E-commerce",
        },
    };
    return payment;
}
    

const payForOrder = async (req, res) => {
    try{
        const {orderId}=req.body;
        const order=await orderService.getOrderById(orderId);
        if(!order){
            return res.status(BAD_REQUEST_STATUS).send({
                message:"Order not found",
            });
        }
        const access_token=await paypalService.getAccessToken();
        const paymentOrderObj=create_order_json(order);
        const resExecute = await axios.post(
            process.env.PAYPAL_CREATE_ORDER_URL, 
            paymentOrderObj, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            }
        );
        return res.status(OK_STATUS).send({
            link:resExecute.data.links.find(link=>link.rel==="approve").href,
            order:order,
            paymentId:resExecute.data.id,
        });
    }
    catch(e){
        console.log(e);
    }
};


const paySuccess=async(req,res)=>{
    try{
        console.log(req.url);
        const result=await paypalService.capturePayment(req.query.token);
        return res.status(OK_STATUS).send({
            message:"Payment success",
        });
    }
    catch(e){
        console.log(e);
    }
}

const payCancel=async(req,res)=>{
    return res.status(OK_STATUS).send({
        message:"Payment cancelled",
    });
}

const getPaymentPage=async(req,res)=>{
    const user=req.user||{_id:"674d9cb7c3008566f71fbf3e"};
    const orders=await orderService.getOrdersByUserId(user._id);
    return res.render("payment",{
        orders:orders,
    }); 
}

export {payForOrder,paySuccess,payCancel,getPaymentPage};