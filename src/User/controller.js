import serviceFactory from "../Factory/serviceFactory.js";
import { hashPassword ,comparePlainAndHashed} from "../utils/hashAndCompare.js";
import sendEmail from "../utils/sendEmail.js";
import dotenv from 'dotenv';
import { randomBytes } from 'crypto';
import uploadImage from "../utils/uploadImage.js"
import fs from 'fs-extra';
dotenv.config();

const userService=serviceFactory.getUserService();
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
    const {fullName,userName,password}=req.body;
    const user={
        fullName,
        userName,
        password:await hashPassword(password),
    }
    const userObj=await userService.createUser(user);
    await userService.saveUser(userObj);
    res.redirect('login');
}

const logoutUser=async(req,res)=>{
    req.session.destroy();
    res.render('products');
}

const register=async(req,res)=>{
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
        return res.status(400).send({
            message: "We have sent to your email"
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).send(e);
    }
}

const resetPassWord = async (req, res) => {
    try {
        const { email, token,newPassword } = req.body;
        if (!email || !token || newPassword.trim().length===0) {
            return res.status(400).send("Bad request");
        }
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(400).send("Bad request");
        }
        const forgotPasswordToken = await forgotPasswordTokenService.getTokenByUserId(user._id);
        if (!forgotPasswordToken) {
            return res.status(400).send("Bad request");
        }
        if (!await comparePlainAndHashed(token, forgotPasswordToken.token)) {
            return res.status(400).send("Bad request");
        }
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await userService.saveUser(user);
        await forgotPasswordTokenService.findAndDeleteByUserId(user._id);
        return res.status(200).send("Success");
    }
    catch (e) {
        return res.status(500);
    }
}

const editInformation =async(req,res)=>{
    const userObj=await userService.getUserById(req.user._id)
    const user = {
        _id:userObj._id,
        fullName: userObj.fullName,
        avatar:userObj.avatar,
        birthDay:userObj.birthDate? userObj.birthDate.toISOString().split('T')[0] : "",
        email:userObj.email
    }
    res.render('profile',{user})
}
const updateInformation=async(req,res,next)=>{
    let user={}
    if(req.file){
        const filePath=req.file.path
        const downLoadUrl= await uploadImage(filePath)
        fs.unlinkSync(filePath)
        user.avatar=downLoadUrl
    }
    user ={...user,...req.body}
    const userObj =await userService.updateUser(req.params.id,user)
    res.redirect('/user/profile')
}

export {register,registerUser,logoutUser,getForgotPasswordPage,getResetPasswordPage,forgotPassword,resetPassWord,editInformation,updateInformation};










