
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const CURRENCY='usd';
const ORDER_SEPARATOR='-';
const stripe =new Stripe(process.env.STRIPE_SECRET_KEY)
const stripeService={
    async createPaymentUrl(orders=[]){
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], 
            line_items: [
                {
                    price_data: {
                        currency: CURRENCY, 
                        product_data: {
                            name: `Order #${orders.join(',')}`, 
                        },
                        unit_amount: orders.reduce((acc,order)=>acc+=Number(order.total),0) * 100, 
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment', 
            success_url: process.env.STRIPE_SUCCESS_URL || `http://localhost:3000/success`, 
            cancel_url: process.env.STRIPE_CANCEL_URL || `http://localhost:3000/cancel`,
            metadata:{
                orderIds:orders.map(order=>order._id).join(ORDER_SEPARATOR),
            }
        });
        return session.url;
    },
    getStripe(){
        return stripe;
    }
};


export default stripeService;