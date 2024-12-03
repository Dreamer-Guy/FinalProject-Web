import Category from "../Model/Category.js";

const categoryService={
    getAll: async()=>{
        return await Category.find().lean();
    },
};

export default categoryService;