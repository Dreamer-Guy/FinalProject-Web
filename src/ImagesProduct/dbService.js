import ImagesProduct from "../Model/ImagesProduct.js";

const imagesProductService={
    async getAllAlternativeImagesOfProduct(id){
        return await ImagesProduct.findOne({productId:id}).lean();
    },
};


export default imagesProductService;