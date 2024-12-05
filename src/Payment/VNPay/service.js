
import moment from 'moment';
import request from 'request';
import querystring from 'qs';
import crypto from 'crypto';


const TMN_CODE=process.env.TMN_CODE
const VNPAY_SECRET=process.env.VNPAY_SECRET
const VNPAY_URL=process.env.VNPAY_URL
const VNPAY_API=process.env.VNPAY_API
const VNPAY_PAYMENT_RETURN_URL=process.env.VNPAY_PAYMENT_RETURN_URL
const ORDER_SEPARATOR='-';

const vnpayService={
    createPaymenURL:(orders)=>{
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        
        let tmnCode =  TMN_CODE;
        let secretKey = VNPAY_SECRET;
        let vnpUrl = VNPAY_URL;
        let returnUrl = VNPAY_PAYMENT_RETURN_URL;
        let orderId = orders.map(order=>order._id).join(ORDER_SEPARATOR);
        let locale = 'vn';
        let currCode = 'VND';
        let vnp_Params = {};
        let ipAddr ='127.0.0.1';
        let bankCode = 'NCB';
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = orders.reduce((acc,order)=>acc+=order.total,0) * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if(bankCode !== null && bankCode !== ''){
            vnp_Params['vnp_BankCode'] = bankCode;
        }
        vnp_Params = vnpayService.sortObject(vnp_Params);
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        return vnpUrl;
    },
    sortObject(obj) {
        let sorted = {};
        let str = [];
        let key;
        for (key in obj){
            if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }
};



export default vnpayService;