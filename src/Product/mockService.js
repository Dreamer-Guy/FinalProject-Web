import Product from "../Model/Product.js";

const mockProducts = [
    {
        "_id": "P01",
        "type": "Phone",
        "name": "Smartphone XYZ",
        "price": 699.99,
        "salePrice": 649.99,
        "brand": "TechBrand",
        "rating": 3.4,
        "totalStock": 50,
        "image": "https://images.pexels.com/photos/3765175/pexels-photo-3765175.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
        "_id": "P02",
        "type": "Laptop",
        "name": "Laptop ABC",
        "price": 1099.99,
        "salePrice": 999.99,
        "brand": "GigaTech",
        "rating": 4.2,
        "totalStock": 30,
        "image": "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
        "_id": "P03",
        "type": "Television",
        "name": "Smart TV 4K",
        "price": 799.99,
        "salePrice": 749.99,
        "brand": "VisualTech",
        "rating": 4.0,
        "totalStock": 20,
        "image": "https://images.pexels.com/photos/279609/pexels-photo-279609.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
        "_id": "P04",
        "type": "Watch",
        "name": "Smartwatch 2.0",
        "price": 199.99,
        "salePrice": 179.99,
        "brand": "ChronoTech",
        "rating": 3.8,
        "totalStock": 100,
        "image": "https://images.pexels.com/photos/167704/pexels-photo-167704.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
        "_id": "P05",
        "type": "Camera",
        "name": "Digital Camera X100",
        "price": 499.99,
        "salePrice": 459.99,
        "brand": "PhotoWorks",
        "rating": 4.5,
        "totalStock": 15,
        "image": "https://images.pexels.com/photos/212372/pexels-photo-212372.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
        "_id": "P06",
        "type": "Phone",
        "name": "Phone Pro Max",
        "price": 799.99,
        "salePrice": 749.99,
        "brand": "MegaTech",
        "rating": 4.1,
        "totalStock": 60,
        "image": "https://images.pexels.com/photos/50614/pexels-photo-50614.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
        "_id": "P07",
        "type": "Laptop",
        "name": "UltraBook Z",
        "price": 1299.99,
        "salePrice": 1199.99,
        "brand": "ElitePC",
        "rating": 4.7,
        "totalStock": 25,
        "image": "https://images.pexels.com/photos/133459/pexels-photo-133459.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
        "_id": "P08",
        "type": "Television",
        "name": "HD TV Plus",
        "price": 499.99,
        "salePrice": 449.99,
        "brand": "Visionary",
        "rating": 3.9,
        "totalStock": 40,
        "image": "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
        "_id": "P09",
        "type": "Watch",
        "name": "Sports Watch Pro",
        "price": 149.99,
        "salePrice": 129.99,
        "brand": "SportyTime",
        "rating": 4.3,
        "totalStock": 80,
        "image": "https://images.pexels.com/photos/12064/pexels-photo-12064.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    },
    {
        "_id": "P10",
        "type": "Camera",
        "name": "ProShot 3000",
        "price": 899.99,
        "salePrice": 849.99,
        "brand": "CaptureIt",
        "rating": 4.6,
        "totalStock": 10,
        "image": "https://images.pexels.com/photos/1002639/pexels-photo-1002639.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
    }
];



const productService = {
    getProducts: async ({ brands, types, sortField, sortOrder }) => {
        const products = mockProducts.filter((product) => {
            if (brands && brands.length > 0 && !brands.includes(product.brand.toLocaleLowerCase())) {
                return false;
            }
            if (types && types.length > 0 && !types.includes(product.type.toLocaleLowerCase())) {
                return false;
            }
            return true;
        }).sort((productA, productB) => {
            if (sortOrder === 1) {
                return productA[sortField] - productB[sortField];
            }
            return productB[sortField] - productA[sortField];
        })
        ||[];
        return products;
    },

    getProductById: async (productId) => {
        const index = mockProducts.findIndex((product) => product._id === productId);
        return mockProducts[index];
    },

    getRelatedProducts:async(product)=>{
        const products=mockProducts
        .filter((p)=>
            p.type.toLocaleLowerCase()===product.type.toLocaleLowerCase() 
            && p._id!==product._id)
        ||[];
        return products;
    }
};

export default productService;