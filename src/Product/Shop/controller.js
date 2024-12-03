import serviceFactory from "../../Factory/serviceFactory.js";

const productService = serviceFactory.getProductSerVice();
const cartService = serviceFactory.getCartService();
const brandService = serviceFactory.getBrandService();
const categoryService = serviceFactory.getCategoryService();
const ROW_PER_PAGE=6;

const formatSortParam=(req)=>{
    const sort=req.query.sort||"price-asc";
    const SORT_FIELD_INDEX=0;
    const SORT_ORDER_INDEX=1;
    const sortParam=sort.split('-');
    const sortField=sortParam[SORT_FIELD_INDEX];
    const sortOrder=sortParam[SORT_ORDER_INDEX];
    return {sortField,sortOrder:sortOrder==='asc'?1:-1};
}

const formatFilterParam=(req)=>{
    const brandsEncoded=req.query.brand||"";
    const categoriesEncoded=req.query.category||"";
    const brands=brandsEncoded?decodeURIComponent(brandsEncoded).split(',')
    .map(brand=>brand.toLowerCase()):[];
    const categories=categoriesEncoded?decodeURIComponent(categoriesEncoded).split(',')
    .map(category=>category.toLowerCase()):[];
    return {brands,categories};    
}

const formatPriceParam=(req)=>{
    const DEFAULT_MIN_PRICE=0;
    const DEFAULT_MAX_PRICE=Number.MAX_VALUE;
    const flag_nullString=isNaN(req.query?.minPrice)||isNaN(req.query?.maxPrice)?true:false;
    const badQueryParams=flag_nullString;
    if(badQueryParams){
        return {minPrice:DEFAULT_MIN_PRICE,maxPrice:DEFAULT_MAX_PRICE};
    }
    const minPrice=Number(req.query.minPrice);
    const maxPrice=Number(req.query.maxPrice);
    return {minPrice,maxPrice};
};
const getQueryParams=(req)=>{
    const {page=1,rowPerPage=ROW_PER_PAGE}=req.query;
    const {brands,categories}=formatFilterParam(req);
    const {sortField,sortOrder}=formatSortParam(req);
    const {minPrice,maxPrice}=formatPriceParam(req);

    return {brands,categories,sortField,sortOrder,page:Number(page),rowPerPage:Number(rowPerPage),minPrice,maxPrice};
}
//controller

const getProductsPage = async (req, res) => {
    try {
        const user = req.user||null;
        const {brands,categories,
            sortField,sortOrder,
            page=1,rowsPerPage=ROW_PER_PAGE,
            minPrice,maxPrice}=getQueryParams(req);
        const {onSales}=req.query;
        const {search}=req.query;
        let products=[];
        if(search && search.trim().length>0){
            products=await productService.getProductsBySearch({search,brands, categories, sortField, sortOrder,minPrice,maxPrice });
        }
        else{
            products = await productService.getProducts({ brands, categories, sortField, sortOrder,minPrice,maxPrice });
        }
        if(onSales==='true'){
            products=products.filter((product)=>product.salePrice>0);
        }
        const totalProducts=products.length;
        if(page && rowsPerPage){
            products=products.slice((page-1)*rowsPerPage,page*rowsPerPage);
        }
        const productsInCart = await cartService.coutProductInCart(user?user._id:null);
        return res.render('products', {
            products:products,
            totalProducts,
            rowsPerPage,
            user,
            cartNumber: productsInCart,
            brands: await brandService.getAll(),
            categories: await categoryService.getAll(),
        });
    }
    catch (e) {
        return res.json({
            data: null,
        });
    }
};

const apiGetProducts=async (req, res) => {
    try {
        const user = req.user||null;
        const {brands,categories,
            sortField,sortOrder,
            page,rowsPerPage=ROW_PER_PAGE,
            minPrice,maxPrice}=getQueryParams(req);
        const {onSales}=req.query;
        const {search}=req.query;
        let products=[];
        if(search && search.trim().length>0){
            products=await productService.getProductsBySearch(search,{brands, categories, sortField, sortOrder,minPrice,maxPrice });
        }
        else{
            products = await productService.getProducts({ brands, categories, sortField, sortOrder,minPrice,maxPrice });
        }
        if(onSales==='true'){
            products=products.filter((product)=>product.salePrice>0);
        }
        const totalProducts=products.length;
        if(page && rowsPerPage){
            products=products.slice((page-1)*rowsPerPage,page*rowsPerPage);
        }
        return res.send({
            totalProducts,
            products,
        });
    }
    catch (e) {
        return res.json({
            data: e.message,
        });
    }
};
export { getProductsPage,apiGetProducts};