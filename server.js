import express from 'express';
import path from 'path';
import session from 'express-session';
import passport from './src/middleWare/PassPort.js';
import methodOverride  from 'method-override'
import mongoose from './src/Config/mongooseDB.js';

import productRouter from "./src/Product/Shop/route.js";
import productDetailsRouter from './src/ProductProperty/Shop/route.js';
import userRouter from './src/User/Shop/route.js';
import homeRouter from './src/HomePage/Shop/route.js';
import reviewRouter from './src/Review/Shop/route.js';
import cartRouter from "./src/Cart/Shop/route.js";
import orderRouter from './src/Order/Shop/route.js';
import addressRouter from './src/Address/Shop/route.js';
import adminCategoryRouter from './src/Category/Admin/categoryRoute.js';

import paypalPaymentRouter from "./src/Payment/PayPal/route.js";
import vnpayPaymentRouter from "./src/Payment/VNPay/route.js";
import stripePaymentRouter from "./src/Payment/Stripe/route.js";

import adminDashBoardRouter from "./src/HomePage/Admin/dashboardRoute.js";
import adminRevenueRouter from  "./src/Revenue/Admin/revenueRoute.js";
import adminProductRouter from './src/Product/Admin/productRoute.js';
import adminBrandRouter from './src/Brand/Admin/brandRoute.js';
import adminUserRouter from './src/User/Admin/userRoute.js'
import adminOrderRouter from './src/Order/Admin/orderRoute.js';
const app = express();
const PORT = process.env.PORT||3000;

app.use(
    '/payment/stripe/webhook',
    express.raw({ type: 'application/json' }) 
);

app.use(express.json());
app.use(methodOverride('_method'))
app.use(express.urlencoded(
    {
        extended:true
    }
))
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    store: new session.MemoryStore(), 
    cookie: { maxAge: 24 * 60 * 60 * 1000 } 
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(process.cwd(), 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));


    app.use("/", homeRouter);
app.use("/products", productRouter);
app.use("/productDetails", productDetailsRouter);
app.use("/user", userRouter);
app.use("/reviews", reviewRouter);
//app.use("/payment/paypal", paypalPaymentRouter); there is problem with this route
//app.use("/payment/vnpay", vnpayPaymentRouter);
app.use("/payment/stripe", stripePaymentRouter);
app.use("/addresses", addressRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);

app.use("/admin/dashboard", adminDashBoardRouter);
app.use("/admin/revenue", adminRevenueRouter);
app.use("/admin/products", adminProductRouter);

app.use("/admin/categories", adminCategoryRouter);
app.use("/admin/brands", adminBrandRouter);

app.use("/admin/users", adminUserRouter);
app.use("/admin/orders", adminOrderRouter);

app.use("/admin/profile", adminUserRouter);
app.use("/admin/changePassword", adminUserRouter);

app.use((req, res) => {
    res.status(404).render('notFound');
}); 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
