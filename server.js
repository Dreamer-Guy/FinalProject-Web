import express from 'express';
import path from 'path';
import productRouter from "./src/Product/route.js";
import productDetailsRouter from "./src/ProductDetails/route.js";
import session from 'express-session';
import passport from './src/middleWare/PassPort.js';
import userRouter from './src/User/route.js';

const app = express();
const PORT = 3000;
app.use(express.json());

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


app.use("/productDetails", productDetailsRouter);
app.use("/products", productRouter);
app.use("/user", userRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
