import mongoose from "mongoose";

// const options={discriminatorKey:'role'};
const userSchema= new mongoose.Schema({
    fullName: {type: String, required: true},
    userName: {type: String, required: true,unique:true},
    password: {type: String, required: true},
    role:{type:String,default:"user"},
    email:{type:String,default:""},
    avatar:{type:String,default:"https://www.kindpng.com/picc/m/78-785827_user-profile-avatar-login"},
    status:{type:String,default:"active"},
    birthDate:{type:Date},
});
const User=mongoose.model('User',userSchema);

export default User;