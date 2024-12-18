import Brand from "../Model/Brand.js";

const brandService = {
    getAll: async () => {
        return await Brand.find().lean();
    },
    create: async (brandData) => {
        const brand = new Brand(brandData);   return await brand.save();
    },
   findByName: async (name) => {
       return await Brand.findOne({ name }).lean();
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