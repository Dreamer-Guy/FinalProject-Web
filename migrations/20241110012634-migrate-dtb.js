import mongoose from "mongoose";
const mockProducts = [
  {
    "type": "Phone",
    "name": "iPhone 13 Pro",
    "price": 999.99,
    "salePrice": 949.99,
    "brand": "Apple",
    "rating": 4.5,
    "totalStock": 40,
    "image": "https://images.pexels.com/photos/6078127/pexels-photo-6078127.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    "type": "Laptop",
    "name": "ASUS ROG Zephyrus",
    "price": 1599.99,
    "salePrice": 1499.99,
    "brand": "ASUS",
    "rating": 4.7,
    "totalStock": 25,
    "image": "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    "type": "Television",
    "name": "Samsung QLED 4K TV",
    "price": 1299.99,
    "salePrice": 1199.99,
    "brand": "Samsung",
    "rating": 4.6,
    "totalStock": 30,
    "image": "https://images.pexels.com/photos/1448378/pexels-photo-1448378.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    "type": "Watch",
    "name": "Apple Watch Series 7",
    "price": 399.99,
    "salePrice": 369.99,
    "brand": "Apple",
    "rating": 4.4,
    "totalStock": 50,
    "image": "https://images.pexels.com/photos/8927576/pexels-photo-8927576.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    "type": "Camera",
    "name": "Sony Alpha 7C",
    "price": 1799.99,
    "salePrice": 1699.99,
    "brand": "Sony",
    "rating": 4.8,
    "totalStock": 15,
    "image": "https://images.pexels.com/photos/10711676/pexels-photo-10711676.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    "type": "Phone",
    "name": "Samsung Galaxy S21",
    "price": 799.99,
    "salePrice": 749.99,
    "brand": "Samsung",
    "rating": 4.3,
    "totalStock": 60,
    "image": "https://images.pexels.com/photos/4601065/pexels-photo-4601065.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    "type": "Laptop",
    "name": "Acer Predator Helios",
    "price": 1399.99,
    "salePrice": 1299.99,
    "brand": "Acer",
    "rating": 4.5,
    "totalStock": 20,
    "image": "https://images.pexels.com/photos/2978837/pexels-photo-2978837.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    "type": "Television",
    "name": "LG OLED TV",
    "price": 999.99,
    "salePrice": 949.99,
    "brand": "LG",
    "rating": 4.2,
    "totalStock": 35,
    "image": "https://images.pexels.com/photos/1031283/pexels-photo-1031283.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    "type": "Watch",
    "name": "Galaxy Watch 4",
    "price": 249.99,
    "salePrice": 229.99,
    "brand": "Samsung",
    "rating": 4.1,
    "totalStock": 75,
    "image": "https://images.pexels.com/photos/3603798/pexels-photo-3603798.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  },
  {
    "type": "Camera",
    "name": "Canon EOS R5",
    "price": 3899.99,
    "salePrice": 3699.99,
    "brand": "Canon",
    "rating": 4.9,
    "totalStock": 8,
    "image": "https://images.pexels.com/photos/2104156/pexels-photo-2104156.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
  }
];

const mockProductDetails = [
  // Phone Details
  {
    productId: "P01",
    description: "A high-end smartphone with excellent camera quality.",
    weight: "204g",
    type: "phone",
    internalMemory: "128GB",
    chip: "A15 Bionic",
    screenSize: "6.1 inches",
    batteryCapacity: "3095mAh",
    operatingSystem: "iOS"
  },
  {
    productId: "P06",
    description: "A flagship smartphone with amazing performance.",
    weight: "228g",
    type: "phone",
    internalMemory: "256GB",
    chip: "Snapdragon 888",
    screenSize: "6.7 inches",
    batteryCapacity: "4500mAh",
    operatingSystem: "Android"
  },

  // Laptop Details
  {
    productId: "P02",
    description: "A powerful gaming laptop with high performance.",
    weight: "2.5kg",
    type: "laptop",
    CPU: "Intel Core i7",
    RAM: "16GB",
    storage: "512GB SSD",
    screenSize: "15.6 inches",
    operatingSystem: "Windows 11"
  },
  {
    productId: "P07",
    description: "A lightweight business laptop with excellent battery life.",
    weight: "1.2kg",
    type: "laptop",
    CPU: "Apple M1",
    RAM: "8GB",
    storage: "256GB SSD",
    screenSize: "13.3 inches",
    operatingSystem: "macOS"
  },

  // Television Details
  {
    productId: "P03",
    description: "A 55-inch QLED TV with vibrant colors and sharp visuals.",
    weight: "17kg",
    type: "television",
    screenSize: "55 inches",
    screenType: "QLED",
    refreshRate: "120Hz",
    imageTechnology: "HDR10+",
    soundTechnology: "Dolby Atmos",
    operatingSystem: "Tizen OS"
  },
  {
    productId: "P08",
    description: "A 65-inch OLED TV with exceptional picture quality.",
    weight: "22kg",
    type: "television",
    screenSize: "65 inches",
    screenType: "OLED",
    refreshRate: "120Hz",
    imageTechnology: "Dolby Vision",
    soundTechnology: "Dolby Atmos",
    operatingSystem: "webOS"
  },

  // Watch Details
  {
    productId: "P04",
    description: "A versatile smartwatch with health tracking features.",
    weight: "38g",
    type: "watch",
    batteryCapacity: "300mAh",
    screenSize: "1.7 inches",
    operatingSystem: "watchOS"
  },
  {
    productId: "P09",
    description: "A durable fitness watch with long battery life.",
    weight: "52g",
    type: "watch",
    batteryCapacity: "450mAh",
    screenSize: "1.4 inches",
    operatingSystem: "Wear OS"
  },

  // Camera Details
  {
    productId: "P05",
    description: "A professional-grade mirrorless camera.",
    weight: "650g",
    type: "camera",
    batteryCapacity: "2280mAh",
    cameraType: "Mirrorless",
    cameraSensor: "Full-frame",
    imageStabilization: "Optical",
    screenSize: "3 inches",
    screenType: "LCD"
  },
  {
    productId: "P10",
    description: "A compact camera ideal for travel photography.",
    weight: "320g",
    type: "camera",
    batteryCapacity: "1240mAh",
    cameraType: "Compact",
    cameraSensor: "APS-C",
    imageStabilization: "Digital",
    screenSize: "2.8 inches",
    screenType: "OLED"
  }
];

const mockUsers=[
    {
      "fullName": "Quoc Vinh",
      "userName": "vinh",
      "password": "$2y$10$gTYBIMRLuYYmIy7GzpojFe7zMJXqlZObegEr.Ogva1KwTfogGMfd.",
      "role":"user",
    },
];


// const productSchema = new mongoose.Schema({
//     type: { type: String, required: true },
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     salePrice: { type: Number },
//     brand: { type: String, required: true },
//     rating: { type: Number, default: 0 },
//     totalStock: { type: Number, required: true },
//     image: String,
// });

// const Product = mongoose.model("Product", productSchema);



export const up = async (db, client) => {
    const products = await db.collection("products").insertMany(mockProducts);
    const productIdMap = products.insertedIds;

    const updatedProductDetails = mockProductDetails.map((detail,index) => {
      return {
        ...detail,
        productId: productIdMap[index].toString(),  
      };
    });

    await db.collection("productdetails").insertMany(updatedProductDetails);
    await db.collection("users").insertMany(mockUsers);
};


export const down = async (db, client) => {
    const productIds = mockProducts.map(product => product._id);
    await db.collection("products").deleteMany({ _id: { $in: productIds } });
    await db.collection("productdetails").deleteMany({ productId: { $in: productIds } });
    await db.collection("users").deleteMany({ userName: { $in: mockUsers.map(user => user.userName) } });
    await db.collection("products").drop();
    await db.collection("productdetails").drop();
    await db.collection("users").drop();
};