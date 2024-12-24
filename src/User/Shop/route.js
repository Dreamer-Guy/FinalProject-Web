import expresss from "express";
import {getRegisterPage,registerUser,logoutUser,
    getForgotPasswordPage,getResetPasswordPage,forgotPassword,
    resetPassWord,getEditInformationPage,updateInformation,
    getChangePasswordPage,changePassword,getAccountPage,
    getLoginPage,handleLogin,handleLoginGoogle}
from "./controller.js";
import passportLocal from "../../middleWare/PassPort.js";
import googlePassPort from "../../middleWare/googlePassport.js";
import upload from "../../Config/multer.js";

const userRouter = expresss.Router();

userRouter.get("/changePassword", getChangePasswordPage);
userRouter.put("/changePassword", changePassword);


userRouter.get("/profile", getEditInformationPage);
userRouter.get("/account", getAccountPage);
userRouter.put('/:id', upload.single('avatar'), updateInformation)



userRouter.get("/login", getLoginPage);
userRouter.post("/loginUser",passportLocal.authenticate('local'),handleLogin);

userRouter.get("/logout",logoutUser);

userRouter.get("/register",getRegisterPage);
userRouter.post("/registeruser",registerUser);

userRouter.get("/forgot/get",getForgotPasswordPage);
userRouter.get("/reset/get",getResetPasswordPage);
userRouter.get("/forgotPassword",forgotPassword);
userRouter.post("/resetPassword",resetPassWord);

userRouter.get("/auth/google",googlePassPort.authenticate('google'),(req, res) => {
    return res.json({
        message:"Login Success",
        redirectUrl:"/products/get"});
});


userRouter.get("/auth/google/callback",googlePassPort.authenticate('google',
    { 
        failureRedirect: '/user/login',
        failureMessage: true
    }),
    handleLoginGoogle);

export default userRouter;