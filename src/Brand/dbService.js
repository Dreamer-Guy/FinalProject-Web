import Brand from "../Model/Brand.js";
const brandService={
    getAll: async()=>{
        return await Brand.find().lean();
    },
};

export default brandService;