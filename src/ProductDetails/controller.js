import serviceFactory from "../Factory/serviceFactory.js";
import {generateRatingStars} from "../utils/viewEngine.js";
const productDetailService=serviceFactory.getProductDetailsSerVice();
const productService=serviceFactory.getProductSerVice();
const populateProduct=(product)=>{
    const populatedProduct={
        productId: product._id,
        type: product.type,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        brand: product.brand,
        totalStock: product.totalStock,
        image: product.image,
        rating: product.rating,
    };
    return populatedProduct;
}

const populateProductDetails=(productDetails)=>{
    const populatedProductDetails={};
    for(const key of Object.keys(productDetails)){
        if(key==='_id'){
            continue;
        }
        populatedProductDetails[key]=productDetails[key];
    }
    return populatedProductDetails;
};



const getProductDetailsByID=async(req,res)=>{
    try{
        const {id}=req.params;
        const productDetails=await productDetailService.get(id);
        const populatedProductDetails=populateProductDetails(productDetails);
        const product=await productService.getProductById(id);
        const rawRelatedProducts=await productService.getRelatedProducts(product)||[];
        const relatedProducts=rawRelatedProducts.map((product)=>populateProduct(product));
        if(productDetails){
            return res.render('productDetails',{product,
                productDetails:populatedProductDetails,
                relatedProducts,
                generateRatingStars});
        }else{
            return res.json({
                data:null,
            })
        }
    }
    catch(error){
        return res.json({
            data:null,
        });
    }
}

// const getProductAllDetails=async(req,res)=>{
//     try{
//         const productDetails=await productDetailService.getAll();
//         if(productDetails){
//             return res.json({
//                 data:productDetails,
//             });
//         }
//         else{
//             return res.json({
//                 data:null,
//             })
//         }
//     }
//     catch(error){
//         return res.json({
//             data:null,
//         });
//     }
// }

export {getProductDetailsByID};