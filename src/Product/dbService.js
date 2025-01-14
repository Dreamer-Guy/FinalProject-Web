import mongoose from "mongoose";
import Product from "../Model/Product.js";
import elasticSearchService from "../UtilServices/ElasticSearchService/productService.js";
import suggesterService from "../UtilServices/ElasticSearchService/suggesterService.js";
import { resolve } from "chart.js/helpers";

const productService = {
    getAll:async()=>{
        return await Product.find({ isDeleted: false })
            .populate('category_id')
            .populate('brand_id')
            .lean();
    },
    create: async (productProps) => {
        const productRes =new Product(productProps);
        const savedProduct=await productRes.save();
        const populatedProduct=await Product.findById(savedProduct._id).populate('category_id').populate('brand_id').lean();
        await elasticSearchService.SynchronizeAfterProductCreation(populatedProduct);
        await suggesterService.SynchronizeAfterProductCreation(populatedProduct);
        return productRes;
    },
    save: async (product) => {
        const savedProduct=await product.save();
        return savedProduct;
    },
    isProductExist: async (productId) => {
        const product = await Product.findById(productId);
        return product !== null;
    },
    getProducts: async ({ brands, categories, sortField='price', sortOrder=1,minPrice=0,priceRange }) => {
        const products = await Product.find({ isDeleted: false })
            .byCategory(categories)
            .byBrand(brands)
            .byPrice(priceRange)
            .sort({ [sortField]: sortOrder })
            .lean();
        const t=products.filter(product=>product.category_id&&product.brand_id);
        return products.filter(product=>product.category_id&&product.brand_id);
    },
    
    getProductById: async (productId) => {
        return await Product.findOne({ _id: productId, isDeleted: false })
            .populate('category_id')
            .populate('brand_id')
            .lean();
    },

    updateByProductId: async (productId, productProps) => {
        const product = await Product
        .findByIdAndUpdate(productId, productProps, { new: true })
        .populate('category_id')
        .populate('brand_id')
        .lean();
        await elasticSearchService.SynchronizeAfterProductUpdate(product);
        await suggesterService.SynchronizeAfterProductUpdate(product);
        return product;
    },

    deleteByProductId: async (productId) => {
        await Product.findByIdAndDelete(productId);
        await elasticSearchService.SynchronizeAfterProductDelete(productId);
        await suggesterService.SynchronizeAfterProductDeletion(productId);
    },

    getRelatedProductsByProductId: async (productId,limit=5) => {
        const product = await Product.findById(productId)
            .populate('brand_id')  
            .populate('category_id')  
            .lean();
        
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: 'categories',  
                    localField: 'category_id',  
                    foreignField: '_id',  
                    as: 'category'  
                }
            },
            {
                $lookup: {
                    from: 'brands',  
                    localField: 'brand_id',  
                    foreignField: '_id',  
                    as: 'brand'  
                }
            },
            {
                $match: {
                    $and: [
                        { isDeleted: false },
                        {
                            $or: [
                                {
                                    'category.name': {
                                        $regex: new RegExp(`^${product.category_id.name}$`, 'i')  
                                    }
                                },
                                {
                                    'brand.name': {
                                        $regex: new RegExp(`^${product.brand_id.name}$`, 'i')  
                                    }
                                }
                            ]
                        },
                        {
                            _id: { $ne: new mongoose.Types.ObjectId(productId) }  
                        }
                    ]
                }
            }
        ]);
        
        return products.slice(0,limit);
    },
    
    getProductsBySearch: async (searchTerm,
        { brands=[], categories=[], sortField='price', sortOrder=1,priceRange }) => {
            const priceConditions=priceRange.map(({minPrice,maxPrice})=>{
                return {
                    price: { $gte: minPrice, $lte: maxPrice }
                }
            });
            const products = await Product.aggregate([
                {
                    $lookup:{
                        from:'brands',
                        localField:'brand_id',
                        foreignField:'_id',
                        as:'brand'
                    }
                },
                {$unwind:'$brand'},
                {
                    $lookup:{
                        from:'categories',
                        localField:'category_id',
                        foreignField:'_id',
                        as:'category'
                    }
                },
                {$unwind:'$category'},
                {
                    $match:{
                        $and: [
                            { isDeleted: false },
                            {
                                $or:[
                                    { 'category.name': { $regex: searchTerm, $options: 'i' } },
                                    { 'brand.name': { $regex: searchTerm, $options: 'i' } },
                                    { name: { $regex: searchTerm, $options: 'i' } },
                                    { description:{ $regex: searchTerm, $options: 'i' }}
                                ]
                            },
                            categories.length > 0 ? { 'category.name': { $in: categories.map(c => new RegExp(c, 'i')) } } : {},
                            brands.length > 0 ? { 'brand.name': { $in: brands.map(b => new RegExp(b, 'i')) } } : {},
                            {
                                $or: priceConditions
                            }
                        ]
                    }
                },
                {
                    $sort: { [sortField]: parseInt(sortOrder) }
                }
            ]);
        return products;
    },

    getTopProducts: async (top) => {
        const products = await Product.find({ isDeleted: false })
            .sort({ rating: -1 })
            .limit(top);
        return products;
    },

    updateQuantityAfterMakingOrder: async (order) => {
        order.items.forEach(async (item) => {
            const product = await Product.findById(item.productId);
            product.totalStock=product.totalStock>=item.quantity?product.totalStock-item.quantity:0;
            await product.save();
        });
    },
    updateProductAfterReviewing:async(productId,rating)=>{
        const product=await Product.findById(productId);
        product.rating=(product.rating*product.numReviews+rating)/(product.numReviews+1);
        product.numReviews=product.numReviews+1;
        const savedProduct=await product.save();
        await elasticSearchService.SynchronizeAfterProductUpdate(savedProduct);
        return savedProduct;
    },
    softDelete: async (id) => {
        const updatedProduct=await Product.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        )
        .populate('category_id')
        .populate('brand_id')
        .lean();   
        await elasticSearchService.SynchronizeAfterProductDelete(id);
        await suggesterService.SynchronizeAfterProductDeletion(id);
        return updatedProduct;
    },
    getPaginated: async ({ skip = 0, limit = 10, sort = {}, filter = {} }) => {
        const baseFilter = { isDeleted: false, ...filter };
        return await Product.find(baseFilter)
            .populate('category_id')
            .populate('brand_id')
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();
    },
    countAll: async (filter = {}) => {
        const baseFilter = { isDeleted: false, ...filter };
        return await Product.countDocuments(baseFilter);
    },
    getDeletedProducts: async ({ brands, categories, sortField='price', sortOrder=1, priceRange }) => {
        const products = await Product.find({ isDeleted: true })
            .byCategory(categories)
            .byBrand(brands)
            .byPrice(priceRange)
            .sort({ [sortField]: sortOrder })
            .lean();
        return products.filter(product => product.category_id && product.brand_id);
    },

    countDeletedProducts: async (filter = {}) => {
        const baseFilter = { isDeleted: true, ...filter };
        return await Product.countDocuments(baseFilter);
    },

    restoreProduct: async (productId) => {
        const restoredProduct=await Product.findByIdAndUpdate(
            productId,
            { isDeleted: false },
            { new: true }
        )
        .populate('category_id')
        .populate('brand_id')
        .lean();
        await elasticSearchService.SynchronizeAfterProductCreation(restoredProduct);
        await suggesterService.SynchronizeAfterProductCreation(restoredProduct);
        return restoredProduct;
    },

    async getProductsFromElastic(search,{brands, categories, sortField, sortOrder,priceRange }){
        return elasticSearchService.search(search,brands, categories, priceRange,sortField, sortOrder,);
    },

    async getSuggestedProducts(search){
        return suggesterService.getSuggestions(search);
    }
};

export default productService;