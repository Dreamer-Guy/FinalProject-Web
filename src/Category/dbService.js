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
    }
};

export default categoryService;