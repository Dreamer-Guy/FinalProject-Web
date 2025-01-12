import expresss from "express";
import userController from "./controller.js";
import passportLocal from "../../middleWare/PassPort.js";
import googlePassPort from "../../middleWare/googlePassport.js";
import upload from "../../Config/multer.js";

const userRouter = expresss.Router();

userRouter.get("/changePassword", userController.getChangePasswordPage);
userRouter.put("/changePassword", userController.changePassword);


userRouter.get("/profile", userController.getEditInformationPage);
userRouter.get("/account", userController.getAccountPage);
userRouter.put('/:id', upload.single('avatar'), userController.updateInformation)



userRouter.get("/login", userController.getLoginPage);
userRouter.post("/loginUser",passportLocal.authenticate('local'),userController.handleLogin);

userRouter.get("/logout",userController.logoutUser);

userRouter.get("/register",userController.getRegisterPage);
userRouter.post("/registeruser",userController.registerUser);

userRouter.get("/forgot/get",userController.getForgotPasswordPage);
userRouter.get("/reset/get",userController.getResetPasswordPage);
userRouter.get("/forgotPassword",userController.forgotPassword);
userRouter.post("/resetPassword",userController.resetPassWord);

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
    userController.handleLoginGoogle);

export default userRouter;