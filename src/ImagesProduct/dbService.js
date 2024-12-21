import ImagesProduct from "../Model/ImagesProduct.js";

const imagesProductService={
    async getAllAlternativeImagesOfProduct(id){
        const t=await ImagesProduct.findOne({productId:id}).lean();
        if(!t){
            return [];
        }
        const images=t.images;
        return images;
    },

    async updateAlternativeImagesOfProductAndInsertIfNotExist(id,images){
        const t=await ImagesProduct.findOne({productId:id});
        if(t){
            t.images=images;
            return await t.save();
        }
        const newImagesProduct=new ImagesProduct({productId:id,images:images});
        return await newImagesProduct.save();
        
    }
};


export default imagesProductService;