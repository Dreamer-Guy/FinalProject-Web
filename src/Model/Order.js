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
    addressId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Address',
    },
    total: {type: Number, required: true},
    orderStatus: {type: String, required: true},
    checkoutStatus: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},  
});


const Order=mongoose.model('Order',orderSchema);
export default Order;