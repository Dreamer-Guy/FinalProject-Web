// module.exports = {
//   async up(db, client) {
//     // TODO write your migration here.
//     // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
//     // Example:
//     // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
//   },

//   async down(db, client) {
//     // TODO write the statements to rollback your migration (if possible)
//     // Example:
//     // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
//   }
// };





import mongoose from "mongoose";

// Dữ liệu mock cho Category
const mockCategories = [
    {
        name: 'Laptop',
        createdAt: new Date('2022-01-01T00:00:00Z'),
    },
    {
        name: 'Television',
        createdAt: new Date('2022-02-01T00:00:00Z'),
    },
    {
        name: 'Camera',
        createdAt: new Date('2022-03-01T00:00:00Z'),
    },
    {
        name: 'Phone',
        createdAt: new Date('2022-04-01T00:00:00Z'),
    },
    {
        name: 'Watch',
        createdAt: new Date('2022-05-01T00:00:00Z'),
    },
];


// Dữ liệu mock cho Brand
const mockBrands = [
    {
        name: 'Samsung',
        createdAt: new Date('2022-02-01T00:00:00Z'),
    },
    {
        name: 'Vivo',
        createdAt: new Date('2022-03-01T00:00:00Z'),
    },
    {
        name: 'Acer',
        createdAt: new Date('2022-04-01T00:00:00Z'),
    },
    {
        name: 'Oppo',
        createdAt: new Date('2022-05-01T00:00:00Z'),
    },
    {
        name: 'Iphone',
        createdAt: new Date('2024-11-30T06:45:33.946Z'),
    },
];


// Dữ liệu mock cho Product
const mockProducts = [
    {
        name: 'iPhone 11 128GB',
        price: 1999,
        salePrice: 1799,
        totalStock: 50,
        image: 'https://cdn.tgdd.vn/Products/Images/42/210644/Slider/iphone-11-128gb638176672333284623.jpeg',
        rating: 4.1,
        description: 'Great',
        status: 'On stock',
        createdAt: new Date('2022-01-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'iPhone 16 Pro Max 256GB',
        price: 999,
        salePrice: 899,
        totalStock: 30,
        image: 'https://cdn.tgdd.vn/Products/Images/42/329149/Slider/vi-vn-iphone-16-pro-max-1.jpg',
        rating: 4.7,
        description: 'Crystal-clear 4K picture quality',
        status: 'On stock',
        createdAt: new Date('2022-02-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Samsung Galaxy M15 5G 4GB/128GB',
        price: 2499,
        salePrice: 2199,
        totalStock: 20,
        image: 'https://cdn.tgdd.vn/Products/Images/42/325073/Slider/samsung-galaxy-m15-5g-4gb638566551162956020.jpg',
        rating: 4.9,
        description: 'Full-frame mirrorless camera for professionals',
        status: 'On stock',
        createdAt: new Date('2022-03-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'OPPO Find N3 5G 16GB/512GB',
        price: 1099,
        salePrice: 999,
        totalStock: 80,
        image: 'https://cdn.tgdd.vn/Products/Images/42/302953/Slider/vi-vn-oppo-find-n3-slider--(1).jpg',
        rating: 4.6,
        description: "Apple's latest flagship smartphone",
        status: 'On stock',
        createdAt: new Date('2022-04-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Realme 13+ 5G 8GB/256GB',
        price: 299,
        salePrice: 249,
        totalStock: 40,
        image: 'https://cdn.tgdd.vn/Products/Images/42/330620/Slider/realme-13-plus-5g-8gb-256gb638677081877884882.jpg',
        rating: 4.5,
        description: 'Advanced smartwatch with Wear OS',
        status: 'On stock',
        createdAt: new Date('2022-05-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Laptop Asus Vivobook Go 15 E1504FA R5 7520U/16GB/512GB/Chuột/Win11 (NJ776W)',
        price: 1399,
        salePrice: 1299,
        totalStock: 25,
        image: 'https://cdn.tgdd.vn/Products/Images/44/311178/Slider/vi-vn-asus-vivobook-go-15-e1504fa-r5-nj776w-slider-1.jpg',
        rating: 4.7,
        description: 'Premium ultrabook for professionals',
        status: 'On stock',
        createdAt: new Date('2022-06-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Laptop Apple MacBook Air 13 inch M1 8GB/256GB (MGN63SA/A)',
        price: 1199,
        salePrice: 1099,
        totalStock: 60,
        image: 'https://cdn.tgdd.vn/Products/Images/44/231244/Slider/apple-macbook-air-2020-mgn63saa638168474820399305.jpg',
        rating: 4.8,
        description: 'Samsung\'s flagship smartphone with S-Pen',
        status: 'On stock',
        createdAt: new Date('2022-07-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Laptop Acer Aspire 3 A315 44P R9W8 R7 5700U/8GB/512GB/Win11 (NX.KSJSV.002)',
        price: 2699,
        salePrice: 2599,
        totalStock: 15,
        image: 'https://cdn.tgdd.vn/Products/Images/44/321436/Slider/vi-vn-acer-aspire-a315-44p-r9w8-r7-nxksjsv002-slider-1.jpg',
        rating: 4.9,
        description: 'Advanced mirrorless camera with high resolution',
        status: 'On stock',
        createdAt: new Date('2022-08-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Laptop Dell Inspiron 15 3520 i5 1235U/16GB/512GB/120Hz/OfficeHS/KYHD/Win11',
        price: 799,
        salePrice: 699,
        totalStock: 70,
        image: 'https://cdn.tgdd.vn/Products/Images/44/321192/Slider/vi-vn-dell-inspiron-15-3520-i5-25p231-slider-1.jpg',
        rating: 4.3,
        description: 'Affordable laptop with gaming capabilities',
        status: 'On stock',
        createdAt: new Date('2022-09-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Laptop HP Gaming VICTUS 15 fa1139TX i5 12450H/16GB/512GB/4GB RTX2050/144Hz/Win11 (8Y6W3PA)',
        price: 1999,
        salePrice: 1899,
        totalStock: 35,
        image: 'https://cdn.tgdd.vn/Products/Images/44/318163/Slider/vi-vn-hp-victus-15-fa1139tx-i5-8y6w3pa-slider-1.jpg',
        rating: 4.9,
        description: 'Best-in-class picture quality with OLED',
        status: 'On stock',
        createdAt: new Date('2022-10-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'BeFit Watch Ultra 52.6mm',
        price: 627.95,
        salePrice: 500,
        totalStock: 40,
        image: 'https://cdn.tgdd.vn/Products/Images/7077/315596/Slider/vi-vn-befit-watch-ultra-day-silicone-fix-1.jpg',
        rating: 4.1,
        description: 'Latest generation iphone',
        status: 'On stock',
        createdAt: new Date(),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Xiaomi Redmi Watch 3 Active 46mm',
        price: 1999,
        salePrice: 1799,
        totalStock: 50,
        image: 'https://cdn.tgdd.vn/Products/Images/7077/311333/Slider/vi-vn-redmi-watch-3-active-sld-1.jpg',
        rating: 4.8,
        description: 'Powerful laptop with M1 Pro chip',
        status: 'On stock',
        createdAt: new Date('2022-01-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Apple Watch Ultra 2 GPS + Cellular 49mm viền Titanium đen dây Alpine',
        price: 1999,
        salePrice: 1799,
        totalStock: 50,
        image: 'https://cdn.tgdd.vn/Products/Images/7077/329719/Slider/vi-vn-apple-watch-ultra-2-gps-cellular-49mm-vien-titanium-day-alpine-sld-f-1.jpg',
        rating: 4.8,
        description: 'Powerful laptop with M1 Pro chip',
        status: 'On stock',
        createdAt: new Date('2022-01-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Apple Watch Series 9 GPS 45mm',
        price: 1999,
        salePrice: 1799,
        totalStock: 50,
        image: 'https://cdn.tgdd.vn/Products/Images/7077/314708/Slider/apple-watch-s9-45mm-vien-nhom-day-silicone638351569262602904.jpg',
        rating: 4.8,
        description: 'Powerful laptop with M1 Pro chip',
        status: 'On stock',
        createdAt: new Date('2022-01-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Samsung Galaxy Watch FE 40mm',
        price: 1999,
        salePrice: 1799,
        totalStock: 50,
        image: 'https://cdn.tgdd.vn/Products/Images/7077/327469/Slider/samsung-galaxy-watch-fe-40mm638555347177674476.jpg',
        rating: 4.8,
        description: 'Powerful laptop with M1 Pro chip',
        status: 'On stock',
        createdAt: new Date('2022-01-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'DJI Action 4 Combo',
        price: 1999,
        salePrice: 1799,
        totalStock: 50,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/o/combo-camera-hanh-dong-dji-action-4_2_.png',
        rating: 4.8,
        description: 'Powerful laptop with M1 Pro chip',
        status: 'On stock',
        createdAt: new Date('2022-01-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Camera Insta360 One X3',
        price: 1999,
        salePrice: 1799,
        totalStock: 50,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/a/camera-hanh-trinh-insta360-one-x3.png',
        rating: 4.8,
        description: 'Powerful laptop with M1 Pro chip',
        status: 'On stock',
        createdAt: new Date('2022-01-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'GoPro Hero 13 Black',
        price: 1999,
        salePrice: 1799,
        totalStock: 50,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_ng_n_3__5_87.png',
        rating: 4.8,
        description: 'Powerful laptop with M1 Pro chip',
        status: 'On stock',
        createdAt: new Date('2022-01-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'DJI Action 4 Combo',
        price: 1999,
        salePrice: 1799,
        totalStock: 50,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/o/combo-camera-hanh-dong-dji-action-4_3_.png',
        rating: 4.8,
        description: 'Powerful laptop with M1 Pro chip',
        status: 'On stock',
        createdAt: new Date('2022-01-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Camera GoPro Hero 12',
        price: 1999,
        salePrice: 1799,
        totalStock: 50,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/c/a/camera-hanh-trinh-gopro-hero-12-phu-kien.png',
        rating: 4.8,
        description: 'Powerful laptop with M1 Pro chip',
        status: 'On stock',
        createdAt: new Date('2022-01-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Smart Tivi Samsung UHD 4K 65 inch UA65AU7700',
        price: 1999,
        salePrice: 1799,
        totalStock: 50,
        image: 'https://cdn2.fptshop.com.vn/unsafe/384x0/filters:quality(100)/2023_8_14_638276187497562577_smart-tivi-samsung-uhd-4k-au7700-3.jpg',
        rating: 4.8,
        description: 'Powerful laptop with M1 Pro chip',
        status: 'On stock',
        createdAt: new Date('2022-01-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Xiaomi Google Tivi A Pro 55 Inch 4K',
        price: 1999,
        salePrice: 1799,
        totalStock: 50,
        image: 'https://cdn2.fptshop.com.vn/unsafe/384x0/filters:quality(100)/2023_8_9_638271937140598065_tivi-xiaomi-a-pro-55-inch-4.jpg',
        rating: 4.8,
        description: 'Powerful laptop with M1 Pro chip',
        status: 'On stock',
        createdAt: new Date('2022-01-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Casper Google Tivi HD 32 inch 32HG5200',
        price: 1999,
        salePrice: 1799,
        totalStock: 50,
        image: 'https://cdn2.fptshop.com.vn/unsafe/384x0/filters:quality(100)/2024_4_8_638481808529924616_casper-32hg5200-5.jpg',
        rating: 4.8,
        description: 'Powerful laptop with M1 Pro chip',
        status: 'On stock',
        createdAt: new Date('2022-01-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Xiaomi Google Tivi 4K A 55 inch 2025 (L55MA-ASEA)',
        price: 1999,
        salePrice: 1799,
        totalStock: 50,
        image: 'https://cdn2.fptshop.com.vn/unsafe/384x0/filters:quality(100)/00910009_tivi_xiaomi_a_55_2025_l55ma_asea_0b7682dc52.png',
        rating: 4.8,
        description: 'Powerful laptop with M1 Pro chip',
        status: 'On stock',
        createdAt: new Date('2022-01-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
    {
        name: 'Casper Google Tivi QLED 4K 55 inch 55QG8000',
        price: 1999,
        salePrice: 1799,
        totalStock: 50,
        image: 'https://cdn2.fptshop.com.vn/unsafe/384x0/filters:quality(100)/2024_1_16_638410017664877956_casper-google-tivi-qled-4k-55-inch-55qg8000-1.jpg',
        rating: 4.8,
        description: 'Powerful laptop with M1 Pro chip',
        status: 'On stock',
        createdAt: new Date('2022-01-01T00:00:00Z'),
        category_id: "None",
        totalRating:10,
        brand_id: "None",
        createdAt: new Date('2022-05-01T00:00:00Z')
    },
];


// Dữ liệu mock cho ProductDetail
const mockProductDetails = [
    {
        productId: null,
        type: "Phone",
        weight: "194g",
        internalMemory: "128GB",
        chip: "Apple A13 Bionic",
        screenSize: "6.1 inches",
        batteryCapacity: "3110mAh",
        operatingSystem: "IOS 17"
    },
    {
        productId: "64a0c88a57f1c78d1b634a10",
        type: "Phone",
        weight: "227g",
        internalMemory: "256GB",
        chip: "Apple A18 Pro 6 nhân",
        screenSize: "6.9 inches",
        batteryCapacity: "4676mAh",
        operatingSystem: "IOS 18"
    },
    {
        productId: "64a0c88a57f1c78d1b634a10",
        type: "Phone",
        weight: "217g",
        internalMemory: "128GB",
        chip: "MediaTek Dimensity 6100+",
        screenSize: "6.5 inches",
        batteryCapacity: "6000mAh",
        operatingSystem: "Android 14"
    },
    {
        productId: "64a0c88a57f1c78d1b634a10",
        type: "Phone",
        weight: "245g",
        internalMemory: "512GB",
        chip: "Sanpdragon 8 Gen 2 8 nhân",
        screenSize: "7.82 inches (main), 6.31 inches (extra)",
        batteryCapacity: "4805mAh",
        operatingSystem: "Android 13"
    },
    {
        productId: "64a0c88a57f1c78d1b634a10",
        type: "Phone",
        weight: "285g",
        internalMemory: "256GB",
        chip: "MediaTek Dimensity 7300 Energy 5G 8 nhân",
        screenSize: "6.67 inches",
        batteryCapacity: "5000mAh",
        operatingSystem: "Android 14"
    },
    {
        productId: "67135ef9a844ab7ea1b00755",
        weight: "1.63kg",
        type: "Laptop",
        CPU: "AMD Ryzen 5 - 7520U",
        RAM: "16GB",
        storage: "512GB SSD",
        screenSize: "15.6 inches",
        operatingSystem: "Windows 11"
    },
    {
        productId: "67135ef9a844ab7ea1b00755",
        weight: "1.29kg",
        type: "Laptop",
        CPU: "Apple M1",
        RAM: "8GB",
        storage: "256GB SSD",
        screenSize: "13.3 inches",
        operatingSystem: "macOS"
    },
    {
        productId: "67135ef9a844ab7ea1b00755",
        weight: "1.7kg",
        type: "Laptop",
        CPU: "AMD Ryzen 7 - 5700U",
        RAM: "8GB",
        storage: "512GB SSD",
        screenSize: "15.6 inches",
        operatingSystem: "Windows 11"
    },
    {
        productId: "67135ef9a844ab7ea1b00755",
        weight: "1.24kg",
        type: "Laptop",
        CPU: "Apple M2",
        RAM: "8GB",
        storage: "256GB SSD",
        screenSize: "13.6 inches",
        operatingSystem: "macOS"
    },
    {
        productId: "67135ef9a844ab7ea1b00755",
        weight: "2.29kg",
        type: "Laptop",
        CPU: "Intel Core i5 Alder Lake - 12450H",
        RAM: "16GB",
        storage: "512GB SSD",
        screenSize: "15.6 inches",
        operatingSystem: "Windows 11"
    },
    {
        productId: "64a0c88a57f1c78d1b634a12",
        weight: "44.52g",
        type: "Watch",
        batteryCapacity: "230mAh",
        screenSize: "1.95 inches",
        operatingSystem: "Không công bố"
    },
    {
        productId: "64a0c88a57f1c78d1b634a12",
        weight: "41.67g",
        type: "Watch",
        batteryCapacity: "289mAh",
        screenSize: "1.83 inches",
        operatingSystem: "Không công bố"
    },
    {
        productId: "64a0c88a57f1c78d1b634a12",
        weight: "61.8g",
        type: "Watch",
        batteryCapacity: "36-72 giờ",
        screenSize: "1.92 inches",
        operatingSystem: "WatchOS"
    },
    {
        productId: "64a0c88a57f1c78d1b634a12",
        weight: "38.7g",
        type: "Watch",
        batteryCapacity: "18-36 giờ",
        screenSize: "1.9 inches",
        operatingSystem: "WatchOS"
    },
    {
        productId: "64a0c88a57f1c78d1b634a12",
        weight: "26.6g",
        type: "Watch",
        batteryCapacity: "247mAh",
        screenSize: "1.2 inches",
        operatingSystem: "WearOS"
    },
    {
        productId: "67135f33a844ab7ea1b0075b",
        weight: "190g",
        type: "Camera",
        batteryCapacity: "1770mAh",
        cameraType: "Action Camera",
        cameraSensor: "CMOS",
        imageStabilization: "Electronic",
        screenSize: "Front Display: 1.4 inches, Rear Display: 2.25 inches",
        screenType: "Touchscreen"
    },
    {
        productId: "67135f33a844ab7ea1b0075b",
        weight: "180g",
        type: "Camera",
        batteryCapacity: "1800mAh",
        cameraType: "360° Action Camera",
        cameraSensor: "Dual 48MP sensors (1/2 inch)",
        imageStabilization: "FlowState",
        screenSize: "2.29 inches",
        screenType: "LCD Touchscreen"
    },
    {
        productId: "67135f33a844ab7ea1b0075b",
        weight: "190g",
        type: "Camera",
        batteryCapacity: "1900mAh",
        cameraType: "Action Camera",
        cameraSensor: "CMOS",
        imageStabilization: "Electronic",
        screenSize: "Front Display: 1.4 inches, Rear Display: 2.27 inches",
        screenType: "Touchscreen"
    },
    {
        productId: "67135f33a844ab7ea1b0075b",
        weight: "246g",
        type: "Camera",
        batteryCapacity: "2250mAh",
        cameraType: "Flycam",
        cameraSensor: "CMOS 1/2.3",
        imageStabilization: "3-pillar mechanics",
        screenSize: "Depends on the connected screen",
        screenType: "Smartphone Screen remote control"
    },
    {
        productId: "67135f33a844ab7ea1b0075b",
        weight: "154g",
        type: "Camera",
        batteryCapacity: "1300mAh",
        cameraType: "Action Camera",
        cameraSensor: "CMOS",
        imageStabilization: "Electronic",
        screenSize: "1.8 inches",
        screenType: "Touchscreen"
    },
    {
        // https://fptshop.com.vn/tivi/smart-tivi-samsung-uhd-4k-65-inch-ua65au7700
        productId: "64a0c88a57f1c78d1b634a11",
        type: "Television",
        weight: "20.9kg",
        screenSize: "65 inches",
        screenType: "UHD",
        refreshRate: "60Hz",
        imageTechnology: "HDR10+",
        soundTechnology: "Adaptive Sound, Q-Symphony kết hợp loa tivi với loa thanh, Cải thiện âm thanh Dialog Enhancement",
        operatingSystem: "OS Tizen",
    },
    {
        // https://fptshop.com.vn/tivi/tivi-xiaomi-a-pro-55-inch
        productId: "64a0c88a57f1c78d1b634a11",
        type: "Television",
        weight: "11.23kg",
        screenSize: "55 inches",
        screenType: "UHD",
        refreshRate: "60Hz",
        imageTechnology: "Dolby Vision, HDR10",
        soundTechnology: "Dolby Audio, DTS Virtual:X, DTS-X",
        operatingSystem: "Android",
    },
    {
        // https://fptshop.com.vn/tivi/casper-goolgle-tivi-hd-32-inch-32hg5200
        productId: "64a0c88a57f1c78d1b634a11",
        type: "Television",
        weight: "3.8kg",
        screenSize: "32 inches",
        screenType: "HD",
        refreshRate: "Không công bố",
        imageTechnology: "Super Brightness, HDR",
        soundTechnology: "Nature Sound, Dolby Audio",
        operatingSystem: "Google TV",
    },
    {
        // https://fptshop.com.vn/tivi/xiaomi-google-tivi-4k-55-inch-a-55-2025-l55ma-asea
        productId: "64a0c88a57f1c78d1b634a11",
        type: "Television",
        weight: "14kg",
        screenSize: "55 inches",
        screenType: "LED",
        refreshRate: "60Hz",
        imageTechnology: "Tăng cường chuyển động MEMC 120Hz, HLG, HDR10, 4K HDR",
        soundTechnology: "Dolby Audio, DTS-X, DTS Virtual:X",
        operatingSystem: "Google TV",
    },
    {
        // https://fptshop.com.vn/tivi/casper-google-tivi-qled-4k-55-inch-55qg8000
        productId: "64a0c88a57f1c78d1b634a11",
        type: "Television",
        weight: "13.4kg",
        screenSize: "65 inches",
        screenType: "QLED",
        refreshRate: "60Hz",
        imageTechnology: "Dolby Vision, HDR10, Tăng cường chuyển động MEMC 120Hz, Màn hình siêu sáng Super Brightness",
        soundTechnology: "Dolby Digital Plus, Dolby Atmos, Pure Sound",
        operatingSystem: "Google TV",
    },
];


// Dữ liệu mock cho ProductProperty
const mockProductProperties = [
    // Sản phẩm 1
    { category_id: null, name: "InternalMemory", createdAt: new Date() },
    { category_id: null, name: "Chip", createdAt: new Date() },
    { category_id: null, name: "ScreenSize", createdAt: new Date() },
    { category_id: null, name: "BatteryCapacity", createdAt: new Date() },
    { category_id: null, name: "OperatingSystem", createdAt: new Date() },

    // Sản phẩm 6
    { category_id: null, name: "CPU", createdAt: new Date("2024-12-01T09:00:00.000Z") },
    { category_id: null, name: "RAM", createdAt: new Date("2024-12-01T09:00:00.000Z") },
    { category_id: null, name: "Storage", createdAt: new Date("2024-12-01T09:00:00.000Z") },
    { category_id: null, name: "ScreenSize", createdAt: new Date("2024-12-01T09:00:00.000Z") },
    { category_id: null, name: "OperatingSystem", createdAt: new Date("2024-12-01T09:00:00.000Z") },

    // Sản phẩm 11
    { category_id: null, name: "ScreenSize", createdAt: new Date("2024-12-01T13:00:00.000Z") },
    { category_id: null, name: "OperatingSystem", createdAt: new Date("2024-12-01T13:00:00.000Z") },
    { category_id: null, name: "BatteryCapacity", createdAt: new Date("2024-12-02T08:05:00.000Z") },
    
    // Sản phẩm 16
    { category_id: null, name: "ScreenSize", createdAt: new Date("2024-12-02T08:20:00.000Z") },
    { category_id: null, name: "OperatingSystem", createdAt: new Date("2024-12-02T08:20:00.000Z") },
    { category_id: null, name: "BatteryCapacity", createdAt: new Date("2024-12-02T08:35:00.000Z") },
    { category_id: null, name: "CameraType", createdAt: new Date("2024-12-02T08:35:00.000Z") },
    { category_id: null, name: "CameraSensor", createdAt: new Date("2024-12-02T08:35:00.000Z") },
    { category_id: null, name: "ImageStabilization", createdAt: new Date("2024-12-02T08:35:00.000Z") },

    // Sản phẩm 22
    {
        category_id: null,
        name: "SoundTechnology",
        createdAt: new Date("2024-12-02T09:00:00.000Z")
    },
    {
        category_id: null,
        name: "OperatingSystem",
        createdAt: new Date("2024-12-02T09:00:00.000Z")
    },
    {
        category_id: null,
        name: "ScreenSize",
        createdAt: new Date("2024-12-02T09:00:00.000Z")
    },
    {
        category_id: null,
        name: "ScreenType",
        createdAt: new Date("2024-12-02T09:00:00.000Z")
    },
    {
        category_id: null,
        name: "RefreshRate",
        createdAt: new Date("2024-12-02T09:00:00.000Z")
    },
    {
        category_id: null,
        name: "ImageTechnology",
        createdAt: new Date("2024-12-02T09:00:00.000Z")
    },
];


// Dữ liệu cho Product Property Values
const mockProductPropertyValues = [
    // Sản phẩm 1
    {
        product_id: null,
        property_id: "InternalMemory",
        value: "128GB",
        createAt: new Date(),
    },
    {
        product_id: null,
        property_id: "Chip",
        value: "Apple A13 Bionic",
        createAt: new Date(),
    },
    {
        product_id: null,
        property_id: "ScreenSize",
        value: "6.1 inches",
        createAt: new Date(),
    },
    {
        product_id: null,
        property_id: "BatteryCapacity",
        value: "3110mAh",
        createAt: new Date(),
    },
    {
        product_id: null,
        property_id: "OperatingSystem",
        value: "IOS 17",
        createAt: new Date(),
    },

    // Sản phẩm 2
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "InternalMemory",
        value: "256GB",
        createAt: new Date(),
    },
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "Chip",
        value: "Apple A18 Pro 6 nhân",
        createAt: new Date(),
    },
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "ScreenSize",
        value: "6.9 inches",
        createAt: new Date(),
    },
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "BatteryCapacity",
        value: "4676mAh",
        createAt: new Date(),
    },
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "OperatingSystem",
        value: "IOS 18",
        createAt: new Date(),
    },

    // Sản phẩm 3
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "InternalMemory",
        value: "128GB",
        createAt: new Date(),
    },
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "Chip",
        value: "MediaTek Dimensity 6100+",
        createAt: new Date(),
    },
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "ScreenSize",
        value: "6.5 inches",
       createAt: new Date(),    
    },
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "BatteryCapacity",
        value: "6000mAh",
        createAt: new Date(),
    },
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "OperatingSystem",
        value: "Android 14",
        createAt: new Date(),
    },

    // Sản phẩm 4
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "InternalMemory",
        value: "512GB",
        createAt: new Date(),
    },
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "Chip",
        value: "Sanpdragon 8 Gen 2 8 nhân",
        createAt: new Date(),
    },
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "ScreenSize",
        value: "7.82 inches (main), 6.31 inches (extra)",
        createAt: new Date(),
    },
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "BatteryCapacity",
        value: "4805mAh",
        createAt: new Date(),
    },
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "OperatingSystem",
        value: "Android 13",
        createAt: new Date(),
    },

    // Sản phẩm 5
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "InternalMemory",
        value: "256GB",
        createAt: new Date(),
    },
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "Chip",
        value: "MediaTek Dimensity 7300 Energy 5G 8 nhân",
        createAt: new Date(),
    },
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "ScreenSize",
        value: "6.67 inches",
        createAt: new Date(),
    },
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "BatteryCapacity",
        value: "5000mAh",
        createAt: new Date(),
    },
    {
        product_id: "64a0c88a57f1c78d1b634a10",
        property_id: "OperatingSystem",
        value: "Android 14",
        createAt: new Date(),
    },

    // Sản phẩm 6
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "CPU",
        value: "AMD Ryzen 5 - 7520U",
        createdAt: new Date("2024-12-01T09:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "RAM",
        value: "16GB",
        createdAt: new Date("2024-12-01T09:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "storage",
        value: "512GB SSD",
        createdAt: new Date("2024-12-01T09:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "screenSize",
        value: "15.6 inches",
        createdAt: new Date("2024-12-01T09:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "operatingSystem",
        value: "Windows 11",
        createdAt: new Date("2024-12-01T09:00:00.000Z")
    },
    // Sản phẩm7
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "CPU",
        value: "Apple M1",
        createdAt: new Date("2024-12-01T10:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "RAM",
        value: "8GB",
        createdAt: new Date("2024-12-01T10:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "storage",
        value: "256GB SSD",
        createdAt: new Date("2024-12-01T10:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "screenSize",
        value: "13.3 inches",
        createdAt: new Date("2024-12-01T10:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "operatingSystem",
        value: "macOS",
        createdAt: new Date("2024-12-01T10:00:00.000Z")
    },
    // Sản phẩm 8
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "CPU",
        value: "AMD Ryzen 7 - 5700U",
        createdAt: new Date("2024-12-01T11:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "RAM",
        value: "8GB",
        createdAt: new Date("2024-12-01T11:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "storage",
        value: "512GB SSD",
        createdAt: new Date("2024-12-01T11:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "screenSize",
        value: "15.6 inches",
        createdAt: new Date("2024-12-01T11:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "operatingSystem",
        value: "Windows 11",
        createdAt: new Date("2024-12-01T11:00:00.000Z")
    },
    // Sản phẩm 9
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "CPU",
        value: "Apple M2",
        createdAt: new Date("2024-12-01T12:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "RAM",
        value: "8GB",
        createdAt: new Date("2024-12-01T12:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "storage",
        value: "256GB SSD",
        createdAt: new Date("2024-12-01T12:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "screenSize",
        value: "13.6 inches",
        createdAt: new Date("2024-12-01T12:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "operatingSystem",
        value: "macOS",
        createdAt: new Date("2024-12-01T12:00:00.000Z")
    },
    // Sản phẩm 10
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "CPU",
        value: "Intel Core i5 Alder Lake - 12450H",
        createdAt: new Date("2024-12-01T13:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "RAM",
        value: "16GB",
        createdAt: new Date("2024-12-01T13:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "storage",
        value: "512GB SSD",
        createdAt: new Date("2024-12-01T13:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "screenSize",
        value: "13.6 inches",
        createdAt: new Date("2024-12-01T12:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "operatingSystem",
        value: "macOS",
        createdAt: new Date("2024-12-01T12:00:00.000Z")
    },
    // Sản phẩm 11
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "screenSize",
        value: "15.6 inches",
        createdAt: new Date("2024-12-01T13:00:00.000Z")
    },
    {
        product_id: "67135ef9a844ab7ea1b00755",
        property_id: "operatingSystem",
        value: "Windows 11",
        createdAt: new Date("2024-12-01T13:00:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a12",
        property_id: "batteryCapacity",
        value: "230mAh",
        createdAt: new Date("2024-12-02T08:00:00.000Z")
    },
    // Sản phẩm 12
    {
        product_id: "64a0c88a57f1c78d1b634a12",
        property_id: "screenSize",
        value: "1.95 inches",
        createdAt: new Date("2024-12-02T08:00:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a12",
        property_id: "operatingSystem",
        value: "Không công bố",
        createdAt: new Date("2024-12-02T08:00:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a12",
        property_id: "batteryCapacity",
        value: "289mAh",
        createdAt: new Date("2024-12-02T08:05:00.000Z")
    },
    // Sản phẩm 13
    {
        product_id: "64a0c88a57f1c78d1b634a12",
        property_id: "screenSize",
        value: "1.83 inches",
        createdAt: new Date("2024-12-02T08:05:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a12",
        property_id: "operatingSystem",
        value: "Không công bố",
        createdAt: new Date("2024-12-02T08:05:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a12",
        property_id: "batteryCapacity",
        value: "36-72 giờ",
        createdAt: new Date("2024-12-02T08:10:00.000Z")
    },
    // Sản phẩm 14
    {
        product_id: "64a0c88a57f1c78d1b634a12",
        property_id: "screenSize",
        value: "1.92 inches",
        createdAt: new Date("2024-12-02T08:10:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a12",
        property_id: "operatingSystem",
        value: "WatchOS",
        createdAt: new Date("2024-12-02T08:10:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a12",
        property_id: "batteryCapacity",
        value: "18-36 giờ",
        createdAt: new Date("2024-12-02T08:15:00.000Z")
    },
    // Sản phẩm 15
    {
        product_id: "64a0c88a57f1c78d1b634a12",
        property_id: "screenSize",
        value: "1.9 inches",
        createdAt: new Date("2024-12-02T08:15:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a12",
        property_id: "operatingSystem",
        value: "WatchOS",
        createdAt: new Date("2024-12-02T08:15:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a12",
        property_id: "batteryCapacity",
        value: "247mAh",
        createdAt: new Date("2024-12-02T08:20:00.000Z")
    },

    // Sản phẩm 16
    {
        product_id: "64a0c88a57f1c78d1b634a12",
        property_id: "screenSize",
        value: "1.2 inches",
        createdAt: new Date("2024-12-02T08:20:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a12",
        property_id: "operatingSystem",
        value: "WearOS",
        createdAt: new Date("2024-12-02T08:20:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "batteryCapacity",
        value: "1770mAh",
        createdAt: new Date("2024-12-02T08:30:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "cameraType",
        value: "Action Camera",
        createdAt: new Date("2024-12-02T08:30:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "cameraSensor",
        value: "CMOS",
        createdAt: new Date("2024-12-02T08:30:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "imageStabilization",
        value: "Electronic",
        createdAt: new Date("2024-12-02T08:30:00.000Z")
    },
    // Sản phẩm 17
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "screenSize",
        value: "Front Display: 1.4 inches, Rear Display: 2.25 inches",
        createdAt: new Date("2024-12-02T08:30:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "screenType",
        value: "Touchscreen",
        createdAt: new Date("2024-12-02T08:30:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "batteryCapacity",
        value: "1800mAh",
        createdAt: new Date("2024-12-02T08:35:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "cameraType",
        value: "360° Action Camera",
        createdAt: new Date("2024-12-02T08:35:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "cameraSensor",
        value: "Dual 48MP sensors (1/2 inch)",
        createdAt: new Date("2024-12-02T08:35:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "imageStabilization",
        value: "FlowState",
        createdAt: new Date("2024-12-02T08:35:00.000Z")
    },
    // Sản phẩm 18
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "screenSize",
        value: "2.29 inches",
        createdAt: new Date("2024-12-02T08:35:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "screenType",
        value: "LCD Touchscreen",
        createdAt: new Date("2024-12-02T08:35:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "batteryCapacity",
        value: "1900mAh",
        createdAt: new Date("2024-12-02T08:40:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "cameraType",
        value: "Action Camera",
        createdAt: new Date("2024-12-02T08:40:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "cameraSensor",
        value: "CMOS",
        createdAt: new Date("2024-12-02T08:40:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "imageStabilization",
        value: "Electronic",
        createdAt: new Date("2024-12-02T08:40:00.000Z")
    },
    // Sản phẩm 19
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "screenSize",
        value: "Front Display: 1.4 inches, Rear Display: 2.27 inches",
        createdAt: new Date("2024-12-02T08:40:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "screenType",
        value: "Touchscreen",
        createdAt: new Date("2024-12-02T08:40:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "batteryCapacity",
        value: "2250mAh",
        createdAt: new Date("2024-12-02T08:45:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "cameraType",
        value: "Flycam",
        createdAt: new Date("2024-12-02T08:45:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "cameraSensor",
        value: "CMOS 1/2.3",
        createdAt: new Date("2024-12-02T08:45:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "imageStabilization",
        value: "3-pillar mechanics",
        createdAt: new Date("2024-12-02T08:45:00.000Z")
    },
    // Sản phẩm 20
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "screenSize",
        value: "Depends on the connected screen",
        createdAt: new Date("2024-12-02T08:45:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "screenType",
        value: "Smartphone Screen remote control",
        createdAt: new Date("2024-12-02T08:45:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "batteryCapacity",
        value: "1300mAh",
        createdAt: new Date("2024-12-02T08:50:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "cameraType",
        value: "Action Camera",
        createdAt: new Date("2024-12-02T08:50:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "cameraSensor",
        value: "CMOS",
        createdAt: new Date("2024-12-02T08:50:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "imageStabilization",
        value: "Electronic",
        createdAt: new Date("2024-12-02T08:50:00.000Z")
    },
    // Sản phẩm 21
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "screenSize",
        value: "1.8 inches",
        createdAt: new Date("2024-12-02T08:50:00.000Z")
    },
    {
        product_id: "67135f33a844ab7ea1b0075b",
        property_id: "screenType",
        value: "Touchscreen",
        createdAt: new Date("2024-12-02T08:50:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "screenSize",
        value: "65 inches",
        createdAt: new Date("2024-12-02T09:00:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "screenType",
        value: "UHD",
        createdAt: new Date("2024-12-02T09:00:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "refreshRate",
        value: "60Hz",
        createdAt: new Date("2024-12-02T09:00:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "imageTechnology",
        value: "HDR10+",
        createdAt: new Date("2024-12-02T09:00:00.000Z")
    },
    // Sản phẩm 22
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "soundTechnology",
        value: "Adaptive Sound, Q-Symphony kết hợp loa tivi với loa thanh, Cải thiện âm thanh Dialog Enhancement",
        createdAt: new Date("2024-12-02T09:00:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "operatingSystem",
        value: "OS Tizen",
        createdAt: new Date("2024-12-02T09:00:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "screenSize",
        value: "55 inches",
        createdAt: new Date("2024-12-02T09:05:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "screenType",
        value: "UHD",
        createdAt: new Date("2024-12-02T09:05:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "refreshRate",
        value: "60Hz",
        createdAt: new Date("2024-12-02T09:05:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "imageTechnology",
        value: "Dolby Vision, HDR10",
        createdAt: new Date("2024-12-02T09:05:00.000Z")
    },
    // Sản phẩm 23
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "soundTechnology",
        value: "Dolby Audio, DTS Virtual:X, DTS-X",
        createdAt: new Date("2024-12-02T09:05:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "operatingSystem",
        value: "Android",
        createdAt: new Date("2024-12-02T09:05:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "screenSize",
        value: "32 inches",
        createdAt: new Date("2024-12-02T09:10:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "screenType",
        value: "HD",
        createdAt: new Date("2024-12-02T09:10:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "refreshRate",
        value: "Không công bố",
        createdAt: new Date("2024-12-02T09:10:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "imageTechnology",
        value: "Super Brightness, HDR",
        createdAt: new Date("2024-12-02T09:10:00.000Z")
    },
    // Sản phẩm 24
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "soundTechnology",
        value: "Nature Sound, Dolby Audio",
        createdAt: new Date("2024-12-02T09:10:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "operatingSystem",
        value: "Google TV",
        createdAt: new Date("2024-12-02T09:10:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "screenSize",
        value: "55 inches",
        createdAt: new Date("2024-12-02T09:15:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "screenType",
        value: "LED",
        createdAt: new Date("2024-12-02T09:15:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "refreshRate",
        value: "60Hz",
        createdAt: new Date("2024-12-02T09:15:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "imageTechnology",
        value: "Tăng cường chuyển động MEMC 120Hz, HLG, HDR10, 4K HDR",
        createdAt: new Date("2024-12-02T09:15:00.000Z")
    },
    // Sản phẩm 25
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "soundTechnology",
        value: "Dolby Audio, DTS-X, DTS Virtual:X",
        createdAt: new Date("2024-12-02T09:15:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "operatingSystem",
        value: "Google TV",
        createdAt: new Date("2024-12-02T09:15:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "screenSize",
        value: "65 inches",
        createdAt: new Date("2024-12-02T09:20:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "screenType",
        value: "QLED",
        createdAt: new Date("2024-12-02T09:20:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "refreshRate",
        value: "60Hz",
        createdAt: new Date("2024-12-02T09:20:00.000Z")
    },
    {
        product_id: "64a0c88a57f1c78d1b634a11",
        property_id: "imageTechnology",
        value: "Dolby Vision, HDR10, Tăng cường chuyển động MEMC 120Hz, Màn hình siêu sáng Super Brightness",
        createdAt: new Date("2024-12-02T09:20:00.000Z")
    },
];


// Mock User
const mockUsers=[
    {
        fullName: "vinh nguyen",
        userName: "vinh123 nguyenGoogle",
        email: "vinh01515@gmail.com",
        password: "$2a$10$B3brr0sjJnx4PYIbZo1ASu0U23nHkNkweRlO8LLRFWFJGjMMZHyFi",
        avatar: "https://lh3.googleusercontent.com/a/ACg8ocLM8bNJw0NiUYgSnFdZ-jIUnxDKfQ…",
        role: "user",
        status:"active",
        birthDate:"2004-11-22T06:41:57.622+00:00",
        createdAt: "2024-11-22T06:41:57.622+00:00",
        __v: 0,
    },
    {
        fullName: "Nguyen quoc vinh",
        userName: "vinh",
        email: "vinh@gmail.com",
        password: "$2a$10$Z1NR6Vc31tUkDMTjN94ZN.2rIUNyaOeQka234Z9yjCzheiNTXsdfa",
        avatar: "",
        role: "user",
        status:"active",
        birthDate:"2004-11-22T06:41:57.622+00:00",
        createdAt: "2024-11-24T14:22:21.243+00:00",
        __v: 0,
    },
    {
        fullName: "abc",
        userName: "abc",
        email: "abc@gmail.com",
        password: "$2a$10$junYf4JC1h3ZfD6ntRSehez6tI.2AJGFdhCODw3l7fj48dFDoRgKy",
        avatar: "",
        role: "user",
        status:"active",
        birthDate:"2004-11-22T06:41:57.622+00:00",
        createdAt: "2024-11-24T17:29:19.582+00:00",
        __v: 0,
    },
    {
        fullName: "Nguyen quoc vinh",
        userName: "vinh123",
        email: "vinh123@gmail.com",
        password: "$2a$10$uXLNcbwIZp/zuZ1VrK36W.2TeS6iG/eN18ZPGVtAR60d80s/mJAgS",
        avatar: "",
        role: "user",
        status:"active",
        birthDate:"2004-11-22T06:41:57.622+00:00",
        createdAt: "2024-11-29T01:03:40.420+00:00",
        __v: 0,
    },
    {
        fullName: "Trần Minh Sơn",
        userName: "Trần Minh SơnGoogle",
        email: "sonhotboy82@gmail.com",
        password: "$2a$10$EEJvQPOx4qCwN1yatGiTLuTZTMuNSRbby0qGtMjymXCkG5phbNeWy",
        avatar: "https://lh3.googleusercontent.com/a/ACg8ocL3JsRS8yKzjLtPRfd_ErpXKFZOax…",
        role: "user",
        status:"active",
        birthDate:"2004-11-22T06:41:57.622+00:00",
        createdAt: "2024-11-29T01:24:07.848+00:00",
        __v: 0,
    },
    {
        fullName: "son",
        userName: "son",
        email: "sontranminh82@gmail.com",
        password: "$2a$10$rYlMSJtHCQAaqvsRvWq52OzfYRfphoYVwLANz0LsvVr6VFZTJl6a2",
        avatar: "",
        role: "user",
        status:"active",
        birthDate:"2004-11-22T06:41:57.622+00:00",
        createdAt: "2024-11-29T01:24:48.677+00:00",
        __v: 0,
    },
    {
        fullName: "duc toan",
        userName: "dt1",
        email: "a@gmail.com",
        password: "$2a$10$afdTmSfFyvm.DGcFLor8uOpnQ.cQXq971xvVnohLAoeu5hmehjq6u",
        avatar: "",
        role: "user",
        status:"active",
        birthDate:"2004-11-22T06:41:57.622+00:00",
        createdAt: "2024-11-30T06:39:41.012+00:00",
        __v: 0,
    },
    {
        fullName: "Duc Toan Nguyen",
        userName: "Duc Toan NguyenGoogle",
        email: "ductoan137303@gmail.com",
        password: "$2a$10$BzYFuMl0Cjucn/e80U2uReoCGL1yTfI9bAJy0tZTehTBnXrNTn/yW",
        avatar: "https://lh3.googleusercontent.com/a/ACg8ocJuMbPymBYpD88AuzQ20OWZ4k4CpM…",
        role: "user",
        status:"active",
        birthDate:"2004-11-22T06:41:57.622+00:00",
        createdAt: "2024-11-30T06:40:23.805+00:00",
        __v: 0,
    }
]
  


// Mock Review
const mockReviews=[
    {
        productId: "None",
        user: "None",
        rating: 4,
        comment: "Good quality, satisfied with the purchase.",
        createdAt: new Date("2024-11-13T12:34:56.789Z"),
    },
    {
        productId: "None",
        user: "None",
        rating: 5,
        comment: "Excellent product, exceeded my expectations!",
        createdAt: new Date("2024-11-13T12:35:56.789Z"),
    },
    {
        productId: "None",
        user: "None",
        rating: 3,
        comment: "Decent, but there's room for improvement.",
        createdAt: new Date("2024-11-13T12:36:56.789Z"),
    },
    {
        productId: "None",
        user: "None",
        rating: 4,
        comment: "Pretty good value for the price.",
        createdAt: new Date("2024-11-13T12:37:56.789Z"),
    },
    {
        productId: "None", // Chuyển sang ObjectId
        userId: "None", // Chuyển sang ObjectId
        rating: 5,
        comment: 'Excellent product, will buy again!',
        createdAt: new Date('2024-01-01T10:00:00'),
    },
    {
        productId: "None", // Chuyển sang ObjectId
        userId: "None", // Chuyển sang ObjectId
        rating: 3,
        comment: 'Average quality, not worth the price.',
        createdAt: new Date('2024-01-02T11:30:00'),
    },
    {
        productId: "None", // Chuyển sang ObjectId
        userId: "None", // Chuyển sang ObjectId
        rating: 4,
        comment: 'Good, but could be better.',
        createdAt: new Date('2024-01-03T12:45:00'),
    },
    {
        productId: "None", // Chuyển sang ObjectId
        userId: "None", // Chuyển sang ObjectId
        rating: 5,
        comment: 'Absolutely love it!',
        createdAt: new Date('2024-01-04T09:00:00'),
    },
    {
        productId: "None", // Chuyển sang ObjectId
        userId: "None", // Chuyển sang ObjectId
        rating: 2,
        comment: 'Not satisfied, expected better.',
        createdAt: new Date('2024-01-05T08:00:00'),
    },
    {
        productId: "None", // Chuyển sang ObjectId
        userId: "None", // Chuyển sang ObjectId
        rating: 1,
        comment: 'Terrible quality, do not recommend.',
        createdAt: new Date('2024-01-06T07:15:00'),
    },
    {
        productId: "None", // Chuyển sang ObjectId
        userId: "None", // Chuyển sang ObjectId
        rating: 4,
        comment: 'Very good, fast delivery.',
        createdAt: new Date('2024-01-07T15:45:00'),
    },
    {
        productId: "None", // Chuyển sang ObjectId
        userId: "None", // Chuyển sang ObjectId
        rating: 3,
        comment: 'Okay, but not worth the price.',
        createdAt: new Date('2024-01-08T18:00:00'),
    },
    {
        productId: "None", // Chuyển sang ObjectId
        userId: "None", // Chuyển sang ObjectId
        rating: 5,
        comment: 'Amazing! Highly recommend!',
        createdAt: new Date('2024-01-09T10:30:00'),
    },
    {
        productId: "None", // Chuyển sang ObjectId
        userId: "None", // Chuyển sang ObjectId
        rating: 4,
        comment: 'Good value for money.',
        createdAt: new Date('2024-01-10T16:00:00'),
    },
  ];


// Mock Cart
const mockCarts=[
    {
      userId: "647f8fc01234567890123456",
      items: [
        {
          productId: "648a1fc01234567890123456",
          quantity: 2
        },
        {
          productId: "648a1fc01234567890123457",
          quantity: 3
        }
      ]
    },
];



export const up = async (db, client) => {
    const categories=await db.collection("categories").insertMany(mockCategories);

    const brands=await db.collection("brands").insertMany(mockBrands);

    const categoryIdMap = categories.insertedIds;

    const brandIdMap = brands.insertedIds;

    const products = await db.collection("products").insertMany(mockProducts);

    const users=await db.collection("users").insertMany(mockUsers);
    
    
    const userIdMap=users.insertedIds;
    
    const productIdMap = products.insertedIds;

    const updatedProductDetails = mockProductDetails.map((detail,index) => {
        return {
        ...detail,
        productId: productIdMap[index],  
        };
    });

    await db.collection("productdetails").insertMany(updatedProductDetails);


    const updatedProducts = mockProducts.map((product) => {
        // Lấy thông tin productDetail tương ứng
        const productDetail = updatedProductDetails.find(detail => detail.productId === product._id);

        // Tìm category phù hợp dựa trên type của productDetail
        const category = mockCategories.find(cat => cat.name === productDetail.type);
        return {
            ...product,
            category_id: categoryIdMap[mockCategories.indexOf(category)], // Gán ID của category
        };
    });


    updatedProducts[0].brand_id = brandIdMap[4]._id;
    updatedProducts[1].brand_id = brandIdMap[4]._id;
    updatedProducts[2].brand_id = brandIdMap[0]._id;
    updatedProducts[3].brand_id = brandIdMap[0]._id;
    updatedProducts[4].brand_id = brandIdMap[4]._id;
    updatedProducts[5].brand_id = brandIdMap[1]._id;
    updatedProducts[6].brand_id = brandIdMap[1]._id;
    updatedProducts[7].brand_id = brandIdMap[2]._id;
    updatedProducts[8].brand_id = brandIdMap[2]._id;
    updatedProducts[9].brand_id = brandIdMap[3]._id;
    updatedProducts[10].brand_id = brandIdMap[4]._id;
    updatedProducts[11].brand_id = brandIdMap[0]._id;
    updatedProducts[12].brand_id = brandIdMap[3]._id;
    updatedProducts[13].brand_id = brandIdMap[0]._id;
    updatedProducts[14].brand_id = brandIdMap[4]._id;
    updatedProducts[15].brand_id = brandIdMap[0]._id;
    updatedProducts[16].brand_id = brandIdMap[1]._id;
    updatedProducts[17].brand_id = brandIdMap[1]._id;
    updatedProducts[18].brand_id = brandIdMap[4]._id;
    updatedProducts[19].brand_id = brandIdMap[0]._id;
    updatedProducts[20].brand_id = brandIdMap[0]._id;
    updatedProducts[21].brand_id = brandIdMap[3]._id;
    updatedProducts[22].brand_id = brandIdMap[3]._id;
    updatedProducts[23].brand_id = brandIdMap[2]._id;
    updatedProducts[24].brand_id = brandIdMap[2]._id;


    for (const product of updatedProducts) {
        // Cập nhật category_id của từng product
        await db.collection("products").updateOne(
            { _id: product._id }, // Tìm sản phẩm bằng _id
            { $set: { 
                category_id: product.category_id,
                brand_id: product.brand_id,
             } }, // Cập nhật category_id
        );
    }


    mockProductProperties[0].category_id = categoryIdMap[3];
    mockProductProperties[1].category_id = categoryIdMap[3];
    mockProductProperties[2].category_id = categoryIdMap[3];
    mockProductProperties[3].category_id = categoryIdMap[3];
    mockProductProperties[4].category_id = categoryIdMap[3];
    mockProductProperties[5].category_id = categoryIdMap[0];
    mockProductProperties[6].category_id = categoryIdMap[0];
    mockProductProperties[7].category_id = categoryIdMap[0];
    mockProductProperties[8].category_id = categoryIdMap[0];
    mockProductProperties[9].category_id = categoryIdMap[0];
    mockProductProperties[10].category_id = categoryIdMap[4];
    mockProductProperties[11].category_id = categoryIdMap[4];
    mockProductProperties[12].category_id = categoryIdMap[4];
    mockProductProperties[13].category_id = categoryIdMap[2];
    mockProductProperties[14].category_id = categoryIdMap[2];
    mockProductProperties[15].category_id = categoryIdMap[2];
    mockProductProperties[16].category_id = categoryIdMap[2];
    mockProductProperties[17].category_id = categoryIdMap[2];
    mockProductProperties[18].category_id = categoryIdMap[2];
    mockProductProperties[19].category_id = categoryIdMap[0];
    mockProductProperties[20].category_id = categoryIdMap[0];
    mockProductProperties[21].category_id = categoryIdMap[0];
    mockProductProperties[22].category_id = categoryIdMap[0];
    mockProductProperties[23].category_id = categoryIdMap[0];
    mockProductProperties[24].category_id = categoryIdMap[0];
    


    const productProperties = await db.collection("productproperties").insertMany(mockProductProperties);
    const propertyIdMap = productProperties.insertedIds; // Lưu _id của các productproperties
    

    const updatedProductPropertyValues = mockProductPropertyValues.map((detail, index) => {
        return {
            ...detail,
            property_id: propertyIdMap[Math.floor(index / 5)],
        };
    });

    updatedProductPropertyValues.forEach((item, index) => {
        if (index < 10) {
            item.product_id = productIdMap[Math.floor(index / 5)];
        } else if (index < 15) {
            item.product_id = productIdMap[Math.floor(index / 3)];
        } else {
            item.product_id = productIdMap[Math.floor(index / 6)];
        }
    });

    await db.collection("productpropertyvalues").insertMany(updatedProductPropertyValues); 

    const updatedReviews=mockReviews.map((review, index)=>{
        return {
            ...review,
            user: userIdMap[0],
            productId: productIdMap[index],  
        }
    });

    await db.collection("reviews").insertMany(updatedReviews);

    const updatedCarts=mockCarts.map((cart)=>{
      return {
        ...cart,
        userId:userIdMap[0],
        items:cart.items.map((item,index)=>{
          return {
            ...item,
            productId:productIdMap[index],
          }
        })
      }
    });

    
    await db.collection("carts").insertMany(updatedCarts);
};

export const down = async (db, client) => {
    const productIds = mockProducts.map(product => product._id);

    // Xóa dữ liệu trong các collection liên quan
    await db.collection("products").deleteMany({ _id: { $in: productIds } });
    await db.collection("productdetails").deleteMany({ productId: { $in: productIds } });
    await db.collection("productproperties").deleteMany({ productId: { $in: productIds } });
    await db.collection("productpropertyvalues").deleteMany({ productId: { $in: productIds } });
    await db.collection("reviews").deleteMany({ productId: { $in: productIds } });
    await db.collection("users").deleteMany({ userName: { $in: mockUsers.map(user => user.userName) } });

    // Xóa các dữ liệu liên quan đến brand và category
    await db.collection("brands").deleteMany({ _id: { $in: Object.values(mockBrands).map(brand => brand._id) } });
    await db.collection("categories").deleteMany({ _id: { $in: Object.values(mockCategories).map(category => category._id) } });

    // Xóa collection nếu cần thiết
    await db.collection("products").drop();
    await db.collection("productdetails").drop();
    await db.collection("productproperties").drop();
    await db.collection("productpropertyvalues").drop();
    await db.collection("reviews").drop();
    await db.collection("users").drop();
    await db.collection("brands").drop();
    await db.collection("categories").drop();
    await db.collection("carts").drop();
};
