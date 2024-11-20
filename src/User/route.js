import expresss from "express";
import {register,registerUser,logoutUser,getForgotPasswordPage,getResetPasswordPage,forgotPassword,resetPassWord} 
from "./controller.js";
import passportLocal from "../middleWare/PassPort.js";
import googlePassPort from "../middleWare/googlePassport.js";
const userRouter = expresss.Router();




userRouter.get("/login", (req, res) => {
    const user=req.user;
    res.render("login",{
        user,
    });
});

userRouter.post("/loginUser",passportLocal.authenticate('local'),(req, res) => {
    // console.log(req.session);
    // console.log(req.sessionID);
    return res.json({message:"Login Success"});
});

userRouter.get("/auth/google",googlePassPort.authenticate('google'),(req, res) => {
    return res.json({message:"Login Success"});
});

userRouter.get("/auth/google/callback",googlePassPort.authenticate('google',
    { failureRedirect: '/user/login' }),
    (req, res) => {
        return res.redirect('/products/get');
});

userRouter.get("/isLogin",(req, res) => {
    res.send("Login Fail");
});

userRouter.get("/logout",logoutUser);
userRouter.get("/register",register);
userRouter.post("/registeruser",registerUser);

userRouter.get("/forgot/get",getForgotPasswordPage);
userRouter.get("/reset/get",getResetPasswordPage);
userRouter.get("/forgotPassword",forgotPassword);
userRouter.post("/resetPassword",resetPassWord);

export default userRouter;