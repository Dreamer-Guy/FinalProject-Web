import expresss from "express";
import {register,registerUser,logoutUser,getForgotPasswordPage,getResetPasswordPage,forgotPassword,
resetPassWord,editInformation,updateInformation,changePassword} 
from "./controller.js";
import passportLocal from "../middleWare/PassPort.js";
import googlePassPort from "../middleWare/googlePassport.js";
const userRouter = expresss.Router();
import multer from "multer";
import path from 'path';
import serviceFactory from "../Factory/serviceFactory.js";
import Address from "../Model/Address.js";

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storageConfig });
const addressService=serviceFactory.getAddressService();

// Change Password  
userRouter.get("/changePassword", (req, res) => {
    const user=req.user;
    // console.log(user);
    res.render("changePassword", {
        user,
        success: null,
        message: ""
    });
});
userRouter.put("/changePassword", changePassword);
//=======================================================  


userRouter.get("/profile", editInformation)
userRouter.get("/account", (req, res) => {
    const user=req.user;
    res.render("account",{
        user,
    });
});
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
    return res.json({message:"Login Success"});
});

// userRouter.post("/loginUser",(req,res,next)=>{
//     passportLocal.authenticate('local', (err, user, info) => {
//         if (err) {
//             return res.status(500).json({ error: 'Internal server error' });
//         }
//         if (!user) {
//             return res.status(401).json({ message: info.message }); 
//         }
//         req.logIn(user, (err) => {
//             if (err) {
//                 return res.status(500).json({ error: 'Bad credentials' });
//             }
//             return res.status(200).json({ message: 'Login successful', user });
//         });
//     })(req, res, next);
// });

userRouter.get("/auth/google",googlePassPort.authenticate('google'),(req, res) => {
    return res.json({message:"Login Success"});
});

userRouter.get("/auth/google/callback",googlePassPort.authenticate('google',
    { failureRedirect: '/user/login' }),
    async (req, res) => {
        const userId = req.user._id;
        const address = await addressService.getAddressByUserId(userId);
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