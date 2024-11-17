import mongoose from "mongoose";

const options={discriminatorKey:'type'};

const ProductDetailSchema=new mongoose.Schema({
    productId:{
        type:String,
        required:true,
    },
    weight:String,
},options);

const ProductDetail=mongoose.model("productdetails",ProductDetailSchema);   

const PhoneDetailSchema= new mongoose.Schema({
    internalMemory:String,
    chip:String,
    screenSize:String,
    batteryCapacity:String,
    operatingSystem:String,
});

const PhoneDetail=ProductDetail.discriminator("phone",PhoneDetailSchema);

const LaptopDetailSchema= new mongoose.Schema({
    CPU:String,
    RAM:String,
    storage:String,
    screenSize:String,
    operatingSystem:String,
});

const LaptopDetail=ProductDetail.discriminator("laptop",LaptopDetailSchema);

const WatchDetailSchema= new mongoose.Schema({
    batteryCapacity:String,
    screenSize:String,
    operatingSystem:String,
});

const WatchDetail=ProductDetail.discriminator("watch",WatchDetailSchema);

const CameraDetailSchema= new mongoose.Schema({
    batteryCapacity:String,
    cameraType:String,
    cameraSensor:String,
    imageStabilization:String,
    screenSize:String,
    screenType:String,
});

const CameraDetail=ProductDetail.discriminator("camera",CameraDetailSchema);
const TelevisionDetailSchema= new mongoose.Schema({
    screenSize:String,
    screenType:String,
    refreshRate:String,
    imageTechnology:String,
    soundTechnology:String,
    operatingSystem:String,
});

const TelevisionDetail=ProductDetail.discriminator("television",TelevisionDetailSchema);

export default ProductDetail;

export{PhoneDetail,LaptopDetail,WatchDetail,CameraDetail,TelevisionDetail};