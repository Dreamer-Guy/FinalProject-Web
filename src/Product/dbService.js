import Product from "../Model/Product.js";


const productService = {
    getProducts: async ({ brands, types, sortField='price', sortOrder=1 }) => {
        const products = Product.find()
            .byBrand(brands)
            .byType(types)
            .sort({ [sortField]: sortOrder })
            .exec();
        return products;
    },
    
    getProductById: async (productId) => {
        const product = await Product.findById(productId);
        return product;
    },

    getRelatedProducts:async(product)=>{
        const products=await Product.find({type:product.type,_id:{$ne:product._id}});
        return products;
    },

    getProductsBySearch: async (searchTerm) => {
        const products = await Product.find({
            $or: [
                { type: { $regex: searchTerm, $options: 'i' } },
                { brand: { $regex: searchTerm, $options: 'i' } },
                { name: { $regex: searchTerm, $options: 'i' } }
            ]
        });
        return products;
    },
    
    getTopProducts: async (top) => {
        const products = await Product.find().sort({ rating: -1 }).limit(top);
        return products;
    },
};

export default productService;