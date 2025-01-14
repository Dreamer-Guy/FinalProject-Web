import stripeService from "./service.js";
import serviceFactory from "../../Factory/serviceFactory.js";

const orderService = serviceFactory.getOrderService();
const ORDER_SEPARATOR = '-';

const webHookHandler= async (req, res) => {
    const endpointSecret=process.env.STRIPE_WEBHOOK_SECRET;
    const stripe=stripeService.getStripe();
    const signature = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                const orderIds = session.metadata.orderIds.split(ORDER_SEPARATOR);
                await orderService.fullfillOrdersByIds(orderIds);
                break;
    
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        res.status(200).send('Event received');
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

const getPaymentUrl = async (req, res) => {
    try {
        const {orderIds} = req.body;
        const orders = await orderService.getOrdersByIds(orderIds);
        const url= await stripeService.createPaymentUrl(orders);
        return res.send(url);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
    };


const getSuccessPage = async (req, res) => {
    try{
        const {session_id} = req.query;
        const stripe=stripeService.getStripe();
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const orderIds = session.metadata.orderIds.split(ORDER_SEPARATOR);
        await orderService.fullfillOrdersByIds(orderIds);
        return res.render("payment/success");
    }
    catch(e){
        console.log(e.message);
        return res.status(500).json({ error: e.message });
    }
};


const getCancelPage = async (req, res) => {
    return res.render("payment/cancel");
};


export {getPaymentUrl,getCancelPage,getSuccessPage,webHookHandler};