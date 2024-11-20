import ForgotPasswordToken from "../Model/ForgotPasswordToken.js";


const forgotPasswordTokenService={
    getTokenByUserId:async(userId)=>{
        return await ForgotPasswordToken.findOne({userId:userId});
    },
    findAndDeleteByUserId:async(userId)=>{
        return await ForgotPasswordToken.findOneAndDelete({userId:userId});
    },
    createToken:async(tokenData)=>{
        return new ForgotPasswordToken(tokenData);
    },
    existsByUserId:async(userId)=>{
        return await ForgotPasswordToken.exists({userId:userId});
    },
    save:async(token)=>{
        return await token.save();
    }
};

export default forgotPasswordTokenService;