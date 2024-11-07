import serviceFactory from "../Factory/serviceFactory.js"
import {generateRatingStars} from "../utils/viewEngine.js";
const productService = serviceFactory.getProductSerVice();


const formatQueryParams = async(filters, sort) => {
    //const {page,rowPerPage}=req.query;
    const sortField = sort?.field?.toLowerCase() || 'price';
    const sortOrder = sort?.order?.toLowerCase() === 'desc' ? -1 : 1;
    const brands = filters?.brands?.map((brand) => (brand.toLowerCase())) || [];
    const types = filters?.types?.map((type) => (type.toLowerCase())) || [];
    return {brands,types,sortField,sortOrder};
    //return {brands,types,sortField,sortOrder,page,rowPAg};
}

const formatSortParam=(sort)=>{
    const SORT_FIELD=0;
    const SORT_ORDER=1;
    const sortParam=sort.split('-');
    const sortField=sortParam[SORT_FIELD];
    const sortOrder=sortParam[SORT_ORDER];
    return {sortField,sortOrder};
}

const formatFilterParam=(filters)=>{
    const brands = filters?.brands?.map((brand) => (brand.toLowerCase())) || [];
    const types = filters?.types?.map((type) => (type.toLowerCase())) || [];
    return {brands,types};    
}

const getQueryParams=(req)=>{
    const {page,rowPerPage}=req.query;
    const {filters={},sort='price-asc'}=req.query;
    const {brands,types}=formatFilterParam(filters);
    const {sortField,sortOrder}=formatSortParam(sort);
    //return {brands,types,sortField,sortOrder};
    return {brands,types,sortField,sortOrder,page,rowPerPage};
}

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


//controller

const fetchAllFilteredProducts = async (req, res) => {
    try {
        const user = req.session?.user;
        const { filters = {}, sort = {} } = req.query;
        const {brands,types,sortField,sortOrder,page,rowPerPage}=getQueryParams(req);
        const products = await productService.getProducts({ brands, types, sortField, sortOrder });
        if(page && rowPerPage){
            products.splice(page*rowPerPage,rowPerPage);
        }
        const populateProducts = products.map((product) => (populateProduct(product)));
        return res.render('products', {products:populateProducts,user,generateRatingStars});
    }
    catch (e) {
        return res.json({
            data: null,
        });
    }
};

// const searchProducts = async (req, res) => {
//     try {
//         const { search } = req.query;
//         const products = await Product.find({
//             $text: {
//                 $search: search,
//             }
//         });
//         const populateProducts = products.map((product) => ({
//             productId: product._id,
//             type: product.type,
//             name: product.name,
//             price: product.price,
//             salePrice: product.salePrice,
//             brand: product.brand,
//             totalStock: product.totalStock,
//             image: product.image,
//             rating: product.rating,
//         }));
//         return res.status(200).send({
//             status: "success",
//             msg: "success fetch products",
//             data: {
//                 products: populateProducts,
//             }
//         });
//     }
//     catch (e) {
//         return res.status(500).send({
//             status: "error",
//             msg: "server err",
//         });
//     }
// };
export { fetchAllFilteredProducts };