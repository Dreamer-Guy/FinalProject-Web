import Category from "../Model/Category.js";
import Product from "../Model/Product.js";
import elasticSearchService from "../UtilServices/ElasticSearchService/productService.js";

const categoryService = {
    getAll: async () => {
        return await Category.find({ isDeleted: false }).lean();
    },

    getDeletedCategories: async () => {
        return await Category.find({ isDeleted: true }).lean();
    },

    softDelete: async (id) => {
        const defaultCategory = await Category.findOne({ name: 'Other' });
        if (!defaultCategory) {
            const otherCategory = new Category({ name: 'Other' });
            await otherCategory.save();
        }

        await Product.updateMany(
            { category_id: id },
            { category_id: defaultCategory._id }
        );
        const updatedCategory=await Category.findByIdAndUpdate(
            id,
            { 
                isDeleted: true,
                deletedAt: new Date()
            },
            { new: true }
        );
        await elasticSearchService.SynchronizeAfterCategoryDelete(id);
        return updatedCategory; 
    },

    restore: async (id) => {
        return await Category.findByIdAndUpdate(
            id,
            { 
                isDeleted: false,
                deletedAt: null
            },
            { new: true }
        );
    },

    countAll: async () => {
        return await Category.countDocuments({ isDeleted: false });
    },

    getPaginated: async ({ skip = 0, limit = 10, sort = {} }) => {
        return await Category.find({ isDeleted: false })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();
    },

    create: async (categoryData) => {
        const category = new Category(categoryData);
        return await category.save();
    },

    findByName: async (name) => {
        return await Category.findOne({ name }).lean();
    },

    findById: async (id) => {
        return await Category.findById(id).lean();
    },

    updateById: async (id, updateData) => {
        const updatedCategory=await Category.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).lean();
        await elasticSearchService.SynchronizeAfterCategoryUpdate(updatedCategory);
        return updatedCategory;
    }
};

export default categoryService;