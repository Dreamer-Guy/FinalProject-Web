import mongoose from "mongoose";

const addressSchema=new mongoose.Schema({
    userId:String,
    street:{type:String,required:false,default:""},
    city:{type:String,required:false,default:""},
    postalCode:{type:String,required:false,default:""},
    phone:{type:String,required:false,default:""},
    notes:String,
});

const Address=mongoose.model("Address",addressSchema);

export default Address;