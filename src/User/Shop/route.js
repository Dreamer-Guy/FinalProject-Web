import expresss from "express";
import {getRegisterPage,registerUser,logoutUser,
    getForgotPasswordPage,getResetPasswordPage,forgotPassword,
    resetPassWord,getEditInformationPage,updateInformation,
    getChangePasswordPage,changePassword,getAccountPage} 
from "./controller.js";
import passportLocal from "../../middleWare/PassPort.js";
import googlePassPort from "../../middleWare/googlePassport.js";
import upload from "../../Config/multer.js";

import serviceFactory from "../../Factory/serviceFactory.js";
import Address from "../../Model/Address.js";
import isUserLoginAndRedirect from "../../middleWare/isUserLoginAndRedirect.js";
const userRouter = expresss.Router();

const addressService=serviceFactory.getAddressService();

const cartService = serviceFactory.getCartService();

// Change Password  
userRouter.get("/changePassword", getChangePasswordPage);
userRouter.put("/changePassword", changePassword);


userRouter.get("/profile", getEditInformationPage);
userRouter.get("/account", getAccountPage);
userRouter.put('/:id', upload.single('avatar'), updateInformation)



userRouter.get("/login", (req, res) => {
    const user=req.user;
    res.render("login",{
        user,
    });
});



userRouter.post("/loginUser",passportLocal.authenticate('local'), async (req, res) => {
    const userId = req.user._id;
    let address = await addressService.getAddressByUserId(userId);
    let cart = await cartService.getCartByUserId(userId);
    if(!address){
        const defaultAddress = new Address({
            userId: userId,
            street: "",
            city: "",
            postalCode: "",
            phone: "",
            notes: ""
        });
        await addressService.saveAddress(defaultAddress);
    }
    
    if(!cart){
        const newCart = await cartService.createCart(userId, []);
        await cartService.saveCart(newCart);
    }
    
    return res.json({message:"Login Success"});
});



userRouter.get("/isLogin",(req, res) => {
    res.send("Login Fail");
});

userRouter.get("/logout",logoutUser);
userRouter.get("/register",getRegisterPage);
userRouter.post("/registeruser",registerUser);

userRouter.get("/forgot/get",getForgotPasswordPage);
userRouter.get("/reset/get",getResetPasswordPage);
userRouter.get("/forgotPassword",forgotPassword);
userRouter.post("/resetPassword",resetPassWord);

userRouter.get("/auth/google",googlePassPort.authenticate('google'),(req, res) => {
    return res.json({message:"Login Success"});
});

userRouter.get("/auth/google/callback",googlePassPort.authenticate('google',
    { 
        failureRedirect: '/user/login',
        failureMessage: true
    }),    
    async (req, res) => {
        try{
            const userId = req.user._id;
            const address = await addressService.getAddressByUserId(userId);
            const cart = await cartService.getCartByUserId(userId);
            if(!address){
                const defaultAddress = new Address({
                    userId: userId,
                    street: "",
                    city: "",
                    postalCode: "",
                    phone: "",
                    notes: ""
                });
                
                await addressService.saveAddress(defaultAddress);
            }
            
            if(!cart){
                const newCart = await cartService.createCart(userId, []);
                await cartService.saveCart(newCart);
            }
            return res.redirect('/products/get');
        }
        catch(err){
            console.log(err.message);
        }
});

export default userRouter;