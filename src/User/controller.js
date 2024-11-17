import serviceFactory from "../Factory/serviceFactory.js";
import { hashPassword } from "../utils/hashAndCompare.js";

const userService=serviceFactory.getUserService();
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


export {register,registerUser,logoutUser};