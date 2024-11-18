import mongoose from "mongoose";

const addressSchema=new mongoose.Schema({
    userId:String,
    street:{type:String,required:true},
    city:{type:String,required:true},
    postalCode:{type:String,required:true},
    phone:{type:String,required:true},
    notes:String,
});

const Address=mongoose.model("Address",addressSchema);

export default Address;