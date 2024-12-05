import dotenv from 'dotenv';
import axios from 'axios';
import jwt from "jsonwebtoken";
dotenv.config();

const paypalService={
    getAccessToken:async()=>{
        const res=await axios.post(process.env.PAYPAL_AUTHENTICATION_URL,
            new URLSearchParams({ grant_type: 'client_credentials' }),
            {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                auth: {
                    username: process.env.PAYPAL_CLIENT_ID,
                    password: process.env.PAYPAL_CLIENT_SECRET,
                },
        });
        console.log(res.data);
        return res.data.access_token;
    },
    capturePayment:async(orderId)=>{
        const access_token=await paypalService.getAccessToken();
        const res=await axios.post(
            `${process.env.PAYPAL_CAPTURE_ORDER_URL}/${orderId}/capture`,
            {},
            {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
            }
        );
        return res.data;
    },
};

export default paypalService;