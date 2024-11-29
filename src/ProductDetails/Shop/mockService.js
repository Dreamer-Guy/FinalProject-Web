import { get } from "mongoose";

const productDetails= [
    {
        productId: "P01",
        description: "Latest smartphone with advanced features.",
        weight: "180g",
        type: "phone",
        internalMemory: "128GB",
        chip: "A14 Bionic",
        screenSize: "6.1 inches",
        batteryCapacity: "2815mAh",
        operatingSystem: "iOS 15"
    },
    {
        productId: "P02",
        description: "Affordable smartphone with great battery life.",
        weight: "170g",
        type: "phone",
        internalMemory: "64GB",
        chip: "Snapdragon 690",
        screenSize: "6.5 inches",
        batteryCapacity: "5000mAh",
        operatingSystem: "Android 11"
    },
    {
        productId: "P03",
        description: "High-performance laptop for gaming.",
        weight: "2kg",
        type: "laptop",
        CPU: "Intel i7",
        RAM: "16GB",
        storage: "512GB SSD",
        screenSize: "15.6 inches",
        operatingSystem: "Windows 10"
    },
    {
        productId: "P04",
        description: "Ultrabook with sleek design and portability.",
        weight: "1.3kg",
        type: "laptop",
        CPU: "Intel i5",
        RAM: "8GB",
        storage: "256GB SSD",
        screenSize: "13.3 inches",
        operatingSystem: "Windows 10"
    },
    {
        productId: "P05",
        description: "Smartwatch with health tracking features.",
        weight: "50g",
        type: "watch",
        batteryCapacity: "400mAh",
        screenSize: "1.5 inches",
        operatingSystem: "Wear OS"
    },
    {
        productId: "P06",
        description: "Fitness tracker with advanced health metrics.",
        weight: "30g",
        type: "watch",
        batteryCapacity: "200mAh",
        screenSize: "1.2 inches",
        operatingSystem: "Fitbit OS"
    },
    {
        productId: "P07",
        description: "Professional DSLR camera for photography enthusiasts.",
        weight: "800g",
        type: "camera",
        batteryCapacity: "1000mAh",
        cameraType: "DSLR",
        cameraSensor: "Full-frame",
        imageStabilization: "Optical",
        screenSize: "3 inches",
        screenType: "LCD"
    },
    {
        productId: "P08",
        description: "Compact mirrorless camera for travel.",
        weight: "600g",
        type: "camera",
        batteryCapacity: "800mAh",
        cameraType: "Mirrorless",
        cameraSensor: "APS-C",
        imageStabilization: "Digital",
        screenSize: "3.5 inches",
        screenType: "Touchscreen"
    },
    {
        productId: "P09",
        description: "4K Ultra HD Smart TV with stunning visuals.",
        weight: "10kg",
        type: "television",
        screenSize: "55 inches",
        screenType: "LED",
        refreshRate: "120Hz",
        imageTechnology: "OLED",
        soundTechnology: "Dolby Atmos",
        operatingSystem: "Android TV"
    },
    {
        productId: "P10",
        description: "Budget-friendly 4K TV with decent performance.",
        weight: "8kg",
        type: "television",
        screenSize: "50 inches",
        screenType: "LCD",
        refreshRate: "60Hz",
        imageTechnology: "LED",
        soundTechnology: "Stereo",
        operatingSystem: "Roku TV"
    }
];



const productDetailsService={
    get:async(id)=>{
        const index=productDetails.findIndex((productDetail)=>productDetail.productId===id);
        return productDetails[index];
    },  
    getAll:async()=>{
        return productDetails;
    },
};

export default productDetailsService;