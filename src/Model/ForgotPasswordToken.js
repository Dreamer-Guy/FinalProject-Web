import mongoose from "mongoose";

const forgotPasswordTokenSchema=new mongoose.Schema({
    userId:String,
    token:String,
});

const ForgotPasswordToken=mongoose.model('forgotPasswordToken',forgotPasswordTokenSchema);
export default ForgotPasswordToken;