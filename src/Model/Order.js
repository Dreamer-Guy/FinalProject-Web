import mongoose from "mongoose";


const orderSchema= new mongoose.Schema({
    userId: String,
    items:[
        {
            productId:String,
            name:String,
            type:String,
            brand:String,
            image:String,
            price:Number,
            salePrice:Number,
            quantity:Number,
        }
    ],
    address:{
        fullName:String,
        street:String,
        city:String,
        postalCode:String,
        phone:String,
    },
    total: {type: Number, required: true},
    orderStatus: {type: String, required: true},
    checkoutStatus: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},  
});


const Order=mongoose.model('Order',orderSchema);
export default Order;