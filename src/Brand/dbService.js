import Brand from "../Model/Brand.js";
import Product from "../Model/Product.js";
import elasticSearchService from "../UtilServices/ElasticSearchService/productService.js";
const brandService = {
    getAll: async () => {
        return await Brand.find({ 
            isDeleted: false
        }).lean();
    },
    
    create: async (brandData) => {
        const brand = new Brand(brandData);
        const savedBrand=await brand.save();   
        return savedBrand; 
    },
    
   findByName: async (name) => {
       return await Brand.findOne({ 
           name,
           isDeleted: false 
       }).lean();
    },
    
    getPaginated: async ({ skip, limit, sort }) => {
        return await Brand.find({ 
            isDeleted: false
        })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();
    },
    
    countAll: async () => {
        return await Brand.countDocuments({ 
            isDeleted: false
        });
    },
    
    
    
    updateById: async (id, updateData) => {
        const brand = await Brand.findById(id);
        if (brand?.name === 'Other') {
            throw new Error('Cannot modify default brand');
        }
        const updatedBrand=await Brand.findByIdAndUpdate(
            id, 
            updateData,
            { new: true }
        ).lean();
        await elasticSearchService.SynchronizeAfterBrandUpdate(updatedBrand);
        return updatedBrand;
    },
    
    findByNameExcept: async (name, excludeId) => {
        return await Brand.findOne({
            name,
            _id: { $ne: excludeId },
            isDeleted: false
        }).lean();
    },
    
    findById: async (id) => {
        return await Brand.findOne({ 
            _id: id,
            isDeleted: false 
        }).lean();
    },
    
    getDefaultBrand: async () => {
        return await Brand.findOne({ 
            name: 'Other',
            isDeleted: false 
        }).lean();
    },
    
    softDeleteBrand: async (brandId) => {
        const brand = await Brand.findById(brandId);
        if (!brand || brand.isDeleted) {
            throw new Error('Brand not found');
        }

        if (brand.name === 'Other') {
            throw new Error('Cannot delete default brand');
        }

        const defaultBrand = await Brand.findOne({ 
            name: 'Other',
            isDeleted: false 
        });

        await Product.updateMany(
            { brand_id: brandId },
            { brand_id: defaultBrand._id }
        );
        const updatedBrand=await Brand.findByIdAndUpdate(
            brandId,
            { isDeleted: true },
            { new: true }
        );
        await elasticSearchService.SynchronizeAfterBrandDelete(brandId);
        return updatedBrand; 
    },

    isDefaultBrand: async (brandId) => {
        const brand = await Brand.findById(brandId).lean();
        return brand?.name === 'Other';
    }
};

export default brandService;