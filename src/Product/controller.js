import serviceFactory from "../Factory/serviceFactory.js"
import {generateRatingStars} from "../utils/viewEngine.js";
const productService = serviceFactory.getProductSerVice();

const ROW_PER_PAGE=6;

const formatQueryParams = async(filters, sort) => {
    //const {page,rowPerPage}=req.query;
    const sortField = sort?.field?.toLowerCase() || 'price';
    const sortOrder = sort?.order?.toLowerCase() === 'desc' ? -1 : 1;
    const brands = filters?.brands?.map((brand) => (brand.toLowerCase())) || [];
    const types = filters?.types?.map((type) => (type.toLowerCase())) || [];
    return {brands,types,sortField,sortOrder};
    //return {brands,types,sortField,sortOrder,page,rowPAg};
}

const formatSortParam=(req)=>{
    const sort=req.query.sort||"price-asc";
    const SORT_FIELD_INDEX=0;
    const SORT_ORDER_INDEX=1;
    const sortParam=sort.split('-');
    const sortField=sortParam[SORT_FIELD_INDEX];
    const sortOrder=sortParam[SORT_ORDER_INDEX];
    return {sortField,sortOrder};
}

const formatFilterParam=(req)=>{
    const brandsEncoded=req.query.brand||"";
    const typesEncoded=req.query.type||"";
    const brands=brandsEncoded?decodeURIComponent(brandsEncoded).split(','):[];
    const types=typesEncoded?decodeURIComponent(typesEncoded).split(','):[];
    return {brands,types};    
}

const getQueryParams=(req)=>{
    const {page,rowPerPage}=req.query;
    const {brands,types}=formatFilterParam(req);
    const {sortField,sortOrder}=formatSortParam(req);
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
        const {brands,types,sortField,sortOrder,page=1,rowsPerPage=ROW_PER_PAGE}=getQueryParams(req);
        let products = await productService.getProducts({ brands, types, sortField, sortOrder });
        const totalProducts=products.length;
        if(page && rowsPerPage){
            products=products.slice((page-1)*rowsPerPage,page*rowsPerPage);
        }
        const populateProducts = products.map((product) => (populateProduct(product)));
        return res.render('products', {
            products:populateProducts,
            totalProducts,
            rowsPerPage,
            user,
            generateRatingStars});
    }
    catch (e) {
        return res.json({
            data: null,
        });
    }
};

const apiGetAllFilteredProducts = async (req, res) => {
    try {
        const {brands,types,sortField,sortOrder,page=1,rowsPerPage=ROW_PER_PAGE}=getQueryParams(req);
        let products = await productService.getProducts({ brands, types, sortField, sortOrder });
        const totalProducts=products.length;
        if(page && rowsPerPage){
            products=products.slice((page-1)*rowsPerPage,page*rowsPerPage);
        }
        const populateProducts = products.map((product) => (populateProduct(product)));
        return res.send({
            products:populateProducts,
            totalProducts,
            rowsPerPage,
        });
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
export { fetchAllFilteredProducts,apiGetAllFilteredProducts };