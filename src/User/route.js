import expresss from "express";
import {registerUser,logoutUser,register} from "./controller.js";
import passportLocal from "../middleWare/PassPort.js";

const userRouter = expresss.Router();


userRouter.get("/login", (req, res) => {
    res.render("login");
});

userRouter.post("/loginUser",passportLocal.authenticate('local'),(req, res) => {
    req.session.user = true;
    console.log(req.session);
    console.log(req.sessionID);
    return res.redirect("/products/get");
});

userRouter.get("/isLogin",(req, res) => {
    console.log(req.session);
    console.log(req.sessionID);
    res.send("Login Fail");
});

userRouter.get("/logout",logoutUser);
userRouter.get("/register",register);
userRouter.post("/registeruser",registerUser);

export default userRouter;