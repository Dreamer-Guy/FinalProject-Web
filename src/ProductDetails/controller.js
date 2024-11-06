import serviceFactory from "../Factory/serviceFactory.js";
import {generateRatingStars} from "../utils/viewEngine.js";
const productDetailService=serviceFactory.getProductDetailsSerVice();
const productService=serviceFactory.getProductSerVice();
const getProductDetailsByID=async(req,res)=>{
    try{
        const {id}=req.params;
        const productDetails=await productDetailService.get(id);
        const product=await productService.getProductById(id);
        if(productDetails){
            return res.render('productDetails',{product,productDetails,generateRatingStars});
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