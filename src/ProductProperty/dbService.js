import ProductProperty from "../Model/ProductProperty.js";
import ProductPropertyValue from "../Model/ProductPropertyValue.js";

const productPropteryService={
    deleteDetailsByPropertyId:async(property_id)=>{
        await ProductPropertyValue.deleteMany({property_id});
    }
    ,
    getProductPropertiesByProductId:async(id)=>{
        const productDetails=await ProductPropertyValue.find({product_id:id}).populate('property_id').lean();
        return productDetails;
    },
    createProductPropertyValue:async(product_id,property_id,value)=>{
        const productPropertyValue=new ProductPropertyValue(product_id,property_id,value);
        return productPropertyValue;
    },

    create:async(productDetails)=>{
        const productPropertyValue=new ProductPropertyValues(productDetails);
        return productPropertyValue;
    },
    save:async(productPropertyValue)=>{
        const savedProductPropertyValue=await productPropertyValue.save();
        return savedProductPropertyValue;
    },
    saveProductPropertiesorProduct:async(productDetails)=>{
        const savedProductDetails=await ProductPropertyValue.insertMany(productDetails);
        return savedProductDetails;
    },
    

    createProductPropertyOfCategory:async(data={category_id:"",name:""})=>{
        const productProperty=new ProductProperty(data);
        return productProperty;
    },

    saveProductPropertyOfCategory:async(productProperty)=>{
        const savedProductProperty=await productProperty.save();
        return savedProductProperty;
    },

    getPropertiesByCategoryId:async(category_id)=>{
        const properties=await ProductProperty
        .find({category_id})
        .lean();
        return properties;
    },

    updateProductProperTiesByProductId:async(id,details=[])=>{
        await ProductPropertyValue.deleteMany({product_id:id});
        const productDetails=details.map((detail)=>{
            return {
                product_id:id,
                property_id:detail?.property_id,
                value:detail?.value,
            };
        })
        await ProductPropertyValue.insertMany(productDetails);
        const updatedProductDetails=await ProductPropertyValue.find({product_id:id}).populate('property_id').lean();
        return updatedProductDetails;
    },
};

export default productPropteryService;