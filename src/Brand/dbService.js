import Brand from "../Model/Brand.js";

const brandService = {
    getAll: async () => {
        return await Brand.find().lean();
    },
    
    getPaginated: async ({ skip, limit, sort }) => {
        return await Brand.find()
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();
    },
    
    countAll: async () => {
        return await Brand.countDocuments();
    }
};

export default brandService;