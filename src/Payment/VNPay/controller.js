import vnpayService from './service.js'
import moment from 'moment';
import request from 'request';
import querystring from 'qs';
import crypto from 'crypto';
import orderService from '../../Order/dbService.js';

//tech-debt : convert USD to VND

const OK_STATUS=200;
const BAD_REQUEST_STATUS=400;

const TMN_CODE=process.env.TMN_CODE;
const VNPAY_SECRET=process.env.VNPAY_SECRET;
const VNPAY_URL=process.env.VNPAY_URL;
const VNPAY_API=process.env.VNPAY_API;
const VNPAY_PAYMENT_RETURN_URL=process.env.VNPAY_PAYMENT_RETURN_URL;
const ORDER_SEPARATOR='-';

const isOrderValid=async (orderIds,amount)=>{
    const orders=await orderService.getOrdersByIds(orderIds);
    if(!orders || orders.length===0){
        return false;
    }
    //extremely becareful with this line (js number is horrible)
    // const sum=orders.reduce((acc,order)=>acc+=order.total*22000,0);
    // if(sum!==amount){
    //     return false;
    // }
    return true;
};

const getPaymentUrl=async (req,res)=>{
    const {orderIds}=req.body;
    const orders= await orderService.getOrdersByIds(orderIds);
    const redirect_url=vnpayService.createPaymenURL(orders);
    return res.send(redirect_url);
};

const getSuccessPage=async (req,res)=>{
    //tech-debt : implement success page
    console.log("success page go");
    return res.status(OK_STATUS).json({message:"success"});
    // let vnp_Params = req.query;
    // let secureHash = vnp_Params['vnp_SecureHash'];
    // let orderId = vnp_Params['vnp_TxnRef'];
    // let rspCode = vnp_Params['vnp_ResponseCode'];
    // let amount= vnp_Params['vnp_Amount']/100;

    // delete vnp_Params['vnp_SecureHash'];
    // delete vnp_Params['vnp_SecureHashType'];

    // vnp_Params = vnpayService.sortObject(vnp_Params);
    // let secretKey = VNPAY_SECRET;
    // let signData = querystring.stringify(vnp_Params, { encode: false }); 
    // let hmac = crypto.createHmac("sha512", secretKey);
    // let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    
    // let paymentStatus = '0'; 
    
    // let checkOrderId = true; 
    // let checkAmount = true; 
    // if(rspCode!== '00'){
    //     console.log("fail response code");
    //     return res.status(OK_STATUS).json({RspCode: '01', Message: 'Fail response code'})
    // };
    // if(secureHash !== signed){
    //     console.log("fail checksum");
    //     return res.status(OK_STATUS).json({RspCode: '97', Message: 'Fail checksum'})
    // }
    // if(!isOrderValid(orderId,amount)){
    //     console.log("order invalid");
    //     return res.status(OK_STATUS).json({RspCode: '01', Message: 'Order not found'})
    // }
    // console.log("successs");
    // await orderService.updatePaidOrderById(orderId);
    // return res.status(OK_STATUS).json({RspCode: '00', Message: 'success'});
};

const getvnIPNBack=async (req, res) => {
    try{
        console.log("ipn back");
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];
        let orderId = vnp_Params['vnp_TxnRef'];
        let rspCode = vnp_Params['vnp_ResponseCode'];
        let amount= vnp_Params['vnp_Amount']/100;

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = vnpayService.sortObject(vnp_Params);
        let secretKey = VNPAY_SECRET;
        let signData = querystring.stringify(vnp_Params, { encode: false }); 
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        const orderIds=orderId.split(ORDER_SEPARATOR);
        if(rspCode==='00' && secureHash===signed && await isOrderValid(orderIds,amount)){
            await orderService.fullfillOrdersByIds(orderIds);
            return res.status(OK_STATUS).json({RspCode: '00', Message: 'success'});
        }
        if(secureHash !== signed){
            return res.status(OK_STATUS).json({RspCode: '97', Message: 'Fail checksum'});
        }
        if(!isOrderValid(orderId,amount)){
            return res.status(OK_STATUS).json({RspCode: '01', Message: 'Order not found'});
        }
        return res.status(OK_STATUS).json({RspCode: '01', Message: 'Fail response code'});
    }
    catch(e){
        return res.status(BAD_REQUEST_STATUS).json({RspCode: '99', Message: 'Fail'})
    }
}




export {getPaymentUrl,getvnIPNBack,getSuccessPage};