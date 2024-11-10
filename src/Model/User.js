import mongoose from "mongoose";

// const options={discriminatorKey:'role'};
const userSchema= new mongoose.Schema({
    fullName: {type: String, required: true},
    userName: {type: String, required: true,unique:true},
    password: {type: String, required: true},
    role:{type:String,default:"user"}
});
const User=mongoose.model('User',userSchema);

export default User;