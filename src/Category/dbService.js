import Category from "../Model/Category.js";

const categoryService = {
    getAll: async () => {
        return await Category.find().lean();
    },

    countAll: async () => {
        return await Category.countDocuments();
    },

    getPaginated: async ({ skip = 0, limit = 10, sort = {} }) => {
        return await Category.find()
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
        return await Category.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).lean();
    }
};

export default categoryService;