import serviceFactory from "../../Factory/serviceFactory.js";
import { hashPassword ,comparePlainAndHashed} from "../../Utils/hashAndCompare.js";
import sendEmail from "../../Utils/sendEmail.js";
import dotenv from 'dotenv';
import { randomBytes } from 'crypto';
import uploadImage from "../../Utils/uploadImage.js"
import fs from 'fs-extra';
import { console } from "inspector";
dotenv.config();

const OK_STATUS = 200;
const BAD_REQUEST_STATUS = 400;
const INTERNAL_SERVER_ERROR_STATUS = 500;

const userService=serviceFactory.getUserService();
const addressService=serviceFactory.getAddressService();
const cartService=serviceFactory.getCartService();

const forgotPasswordTokenService=serviceFactory.getForgotPasswordTokenService();

const generateGetPasswordLink = (queryData) => {
    const query = new URLSearchParams(queryData).toString();
    const generateLink = process.env.FORGET_PASSWORD_URL + "?" + query;
    return generateLink;
};

const handleSendEmail = async (userId, userEmail) => {
    if(await forgotPasswordTokenService.existsByUserId(userId)){
        await forgotPasswordTokenService.findAndDeleteByUserId(userId);
    };
    const TOKEN_LENGTH = 32;
    const token = randomBytes(TOKEN_LENGTH).toString('hex');
    const newToken=await forgotPasswordTokenService.createToken({userId:userId,token:await hashPassword(token)});
    await forgotPasswordTokenService.save(newToken);
    const getPasswordLink=generateGetPasswordLink({
        email:userEmail,
        token,
    });
    const from=process.env.GOOGLE_WEB_EMAIL;
    const to=userEmail;
    const subject="Forget password";
    const text="Click to the link below to reset your password";
    const html=`<a href="${getPasswordLink}">Click to reset your password</a>`;
    await sendEmail(from, to, subject, text, html);
}

const registerUser=async(req,res)=>{
    try{
        const {fullName,userName,password,confirm}=req.body;
        if(!fullName || !userName || !password || !confirm){
            return res.status(BAD_REQUEST_STATUS).send({message:"Miss required information"});
        }
        if(await userService.isUserExistByUserName(userName)){
            return res.status(BAD_REQUEST_STATUS).send({message:"User name is already taken"});
        }
        if(password!==confirm){
            return res.status(BAD_REQUEST_STATUS).send({message:"Password and confirm password are not the same"});
        }
        const user={
            fullName,
            userName,
            password:await hashPassword(password),
        }
        const userObj=await userService.createUser(user);
        await userService.saveUser(userObj);
        return res.status(OK_STATUS).send({message:"Register successfully"});
    }
    catch(e){
        return res.status(INTERNAL_SERVER_ERROR_STATUS).send(e.message);
    }  
}

const logoutUser=async(req,res)=>{
    res.clearCookie('connect.sid');
    res.redirect('/products/get');
}

const getRegisterPage=async(req,res)=>{
    const user=req.user;
    res.render('register',{
        user,
    });
}

const getForgotPasswordPage=async(req,res)=>{
    res.render('forgotPassword');
};

const getResetPasswordPage=async(req,res)=>{
    res.render('resetPassword');
};

const forgotPassword = async (req, res) => {    
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).send("Miss email");
        }
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(400).send("User not found"); 1
        }
        await handleSendEmail(user._id, user.email);
        return res.status(200).send({
            message: "We have sent to your email"
        });
    }
    catch (e) {
        return res.status(500).send(e);
    }
}

const resetPassWord = async (req, res) => {
    try {
        const { email, token,newPassword,confirmPassword } = req.body;
        if (!email || !token || newPassword.trim().length===0 || confirmPassword.trim().length===0) {
            return res.status(400).send({
                message:"Miss required information",
            });
        }
        if(newPassword!==confirmPassword){
            return res.status(400).send({
                message:"Password and confirm password are not the same",
            });
        }
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(400).send({
                message:"User not found",
            });
        }
        const forgotPasswordToken = await forgotPasswordTokenService.getTokenByUserId(user._id);
        if (!forgotPasswordToken) {
            return res.status(400).send({
                message:"This link is expried, please resend request",
            });
        }
        if (!await comparePlainAndHashed(token, forgotPasswordToken.token)) {
            return res.status(400).send({
                message:"Unauthorized request",
            });
        }
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await userService.saveUser(user);
        await forgotPasswordTokenService.findAndDeleteByUserId(user._id);
        return res.status(200).send({
            message:"Reset password successfully",
        });
    }
    catch (e) {
        return res.status(500);
    }
}

const getEditInformationPage =async(req,res)=>{
    const userObj=await userService.getUserById(req.user._id)
    const productsInCart = await cartService.coutProductInCart(userObj._id);
    const user = {
        _id:userObj._id,
        fullName: userObj.fullName,
        avatar:userObj.avatar,
        birthDay:userObj.birthDate? userObj.birthDate.toISOString().split('T')[0] : "",
        email:userObj.email
    }
    res.render('profile',{
        user: user,
        cartNumber: productsInCart
    })
}
const updateInformation=async(req,res,next)=>{
    let user={};
    if(req.file){
        const filePath=req.file.path;
        const downLoadUrl= await uploadImage(filePath);
        fs.unlinkSync(filePath);
        user.avatar=downLoadUrl;
    }
    user ={...user,...req.body}
    const userObj =await userService.updateUser(req.params.id,user);
    res.redirect('/user/profile')
}

const getChangePasswordPage = async (req, res) => {
    const user = req.user;
    const producstInCart = await cartService.coutProductInCart(user._id);
    res.render('changePassword', {
        user: user,
        success: true,
        message: "",
        cartNumber: producstInCart
    });
}
const changePassword = async (req, res) => {
   try {
    const {oldPassword,newPassword, confirmNewPassword}=req.body;
    const user = req.user._id;
    const userObj = await userService.getUserById(user);
    const producstInCart = await cartService.coutProductInCart(user._id);
    if(!userObj){
        return res.render('changePassword',{
            user: user,
            success: false,
            message: "User not found",
            cartNumber:producstInCart,       
        });
    }
    
    if(!await comparePlainAndHashed(oldPassword,userObj.password)){
        return res.render('changePassword',{
            user: req.user,
            success: false,
            message: "Old password is incorrect",
            cartNumber:producstInCart, 
        });
    }
    
    if(newPassword !== confirmNewPassword){
        return res.render('changePassword',{
            user: req.user,
            success: false,
            message: "New password and confirm new password are not the same",
            cartNumber:producstInCart,       
        });
    }
    
    userObj.password = await hashPassword(newPassword);
    await userService.saveUser(userObj);

    return res.render('login',{
        user: null,
    });
    
   } catch (err) {
       console.log(err);
       
       return res.render('changePassword',{
            user: req.user,
            success: false,
            message: `Error: ${err.message}`,
            cartNumber:0,
       });
   }
};

const getAccountPage = async (req, res) => {
    const user = req.user;
    const productsInCart = await cartService.coutProductInCart(user._id);
    res.render("account",{
        user,
        productsInCart,
    });
}

const getLoginPage=async(req,res)=>{
    const user=req.user;
    res.render('login',{
        user,
    });
}

const initUserDataAfterLogin=async (req, res) => {
    try {
        const userId = req.user._id;
        let address = await addressService.getAddressByUserId(userId);
        let cart = await cartService.getCartByUserId(userId);
        
        if(!address){
            const defaultAddressData = {
                userId: userId,
                street: "",
                city: "",
                postalCode: "", 
                phone: "",
                notes: ""
            }
            const address = await addressService.createAddress(defaultAddressData);
            await addressService.saveAddress(address);
        }
        
        if(!cart){
            const newCart = await cartService.createCart(userId, []);
            await cartService.saveCart(newCart);
        }

        const redirectUrl = req.user.role === 'admin' ? '/admin/dashboard' : '/';
        
        return res.json({
            message: "Login Success",
            redirectUrl: redirectUrl
        });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

export {
    getRegisterPage,registerUser,logoutUser,getForgotPasswordPage,
    getResetPasswordPage,forgotPassword,
    resetPassWord,getEditInformationPage,updateInformation,
    getChangePasswordPage,changePassword,getAccountPage,
    getLoginPage,initUserDataAfterLogin};










