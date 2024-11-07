import userService from "./mockService.js";
import { hashPassword } from "../utils/hashAndCompare.js";
const registerUser=async(req,res)=>{
    const {fullName,userName,password}=req.body;
    const user={
        fullName,
        userName,
        password:await hashPassword(password),
    }
    userService.createUser(user);
    console.log(user);
    await userService.saveUser(user);
    res.redirect('login');
}

const logoutUser=async(req,res)=>{
    console.log("bug");
    req.session.destroy();
    res.render('products');
}

const register=async(req,res)=>{
    res.render('register');
}


export {register,registerUser,logoutUser};