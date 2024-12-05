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
    const sum=orders.reduce((acc,order)=>acc+=order.total,0);
    if(sum!==amount){
        return false;
    }
    return true;
};

const getPaymentPage=async (req,res)=>{
    const {orderIds}=req.params;
    const orders= await orderService.getOrdersByIds(orderIds);
    // const orders=[{
    //     _id:"0b1c4e2e-5233-4706-9cfb-fdf5b71b64f6-8e3213-sdashdkjhaskjdhaksdhashdkas-bf-4b25-40a6-9bde-d94f5b7ab4c7-d2a39e91-c462-4f1e-8d3b-63cb8e685bc6",
    //     total:500000,
    // }];
    const redirect_url=vnpayService.createPaymenURL(orders);
    return res.redirect(redirect_url);
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

    
    //let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó
    
    //let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    //let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    // if(secureHash === signed){ //kiểm tra checksum
    //     if(checkOrderId){
    //         if(checkAmount){
    //             if(paymentStatus=="0"){ //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
    //                 if(rspCode=="00"){
    //                     //thanh cong
    //                     //paymentStatus = '1'
    //                     // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
    //                     res.status(200).json({RspCode: '00', Message: 'Success'})
    //                 }
    //                 else {
    //                     //that bai
    //                     //paymentStatus = '2'
    //                     // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
    //                     res.status(200).json({RspCode: '00', Message: 'Success'})
    //                 }
    //             }
    //             else{
    //                 res.status(200).json({RspCode: '02', Message: 'This order has been updated to the payment status'})
    //             }
    //         }
    //         else{
    //             res.status(200).json({RspCode: '04', Message: 'Amount invalid'})
    //         }
    //     }       
    //     else {
    //         res.status(200).json({RspCode: '01', Message: 'Order not found'})
    //     }
    // }
    // else {
    //     res.status(200).json({RspCode: '97', Message: 'Checksum failed'})
    // }
    if(rspCode==='00' && secureHash===signed && isOrderValid(orders,amount)){
        const orderIds=orderId.split('-');
        await orderService.fullfillOrdersByIds(orderIds);
        return res.status(OK_STATUS).json({RspCode: '00', Message: 'success'});
    }
    if(secureHash !== signed){
        return res.status(OK_STATUS).json({RspCode: '97', Message: 'Fail checksum'})
    }
    if(!isOrderValid(orderId,amount)){
        return res.status(OK_STATUS).json({RspCode: '01', Message: 'Order not found'})
    }
    
    return res.status(OK_STATUS).json({RspCode: '01', Message: 'Fail response code'})
}




export {getPaymentPage,getvnIPNBack,getSuccessPage};