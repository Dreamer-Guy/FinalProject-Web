import express from 'express';
import path from 'path';
import session from 'express-session';
import passport from './src/middleWare/PassPort.js';
import methodOverride  from 'method-override'
import mongoose from './src/Config/mongooseDB.js';

import productRouter from "./src/Product/route.js";
import productDetailsRouter from "./src/ProductDetails/route.js";
import userRouter from './src/User/route.js';
import homeRouter from './src/HomePage/controller.js';
import reviewRouter from './src/Review/route.js';
import cartRouter from "./src/Cart/route.js";
import orderRouter from './src/Order/route.js';
import addressRouter from './src/Address/route.js';

const app = express();
const PORT = 3000;
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
app.use("/productDetails", productDetailsRouter);
app.use("/products", productRouter);
app.use("/user", userRouter);
app.use("/addresses", addressRouter);
app.use("/reviews", reviewRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);
app.use((req, res) => {
    res.status(404).render('notFound');
}); 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
