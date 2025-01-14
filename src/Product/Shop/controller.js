import serviceFactory from "../../Factory/serviceFactory.js";
import formatNumber from "../../utils/formatNumber.js";

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
    const priceRangQuery=req.query.priceRange||`${DEFAULT_MIN_PRICE}-${DEFAULT_MAX_PRICE}`;
    const priceRange=priceRangQuery.split(',')||[];
    const formatedPriceRange=priceRange.map(price=>{
        const [minPrice,maxPrice]=price.split('-');
        return {minPrice:Number(minPrice),maxPrice:Number(maxPrice)};
    });
    return formatedPriceRange;
};
const getQueryParams=(req)=>{
    const {page=1,rowPerPage=ROW_PER_PAGE}=req.query;
    const {brands,categories}=formatFilterParam(req);
    const {sortField,sortOrder}=formatSortParam(req);
    const priceRange=formatPriceParam(req);

    return {brands,categories,sortField,sortOrder,page:Number(page),rowPerPage:Number(rowPerPage),priceRange};
}

const populateProduct=(product)=>{
    return {
        ...product,
        price:formatNumber.decimal(product.price),
        salePrice:formatNumber.decimal(product.salePrice),
    }
};

const populateAggregatedProducts=(product)=>{
    delete product.category_id;
    delete product.brand_id;
    return {
        ...product,
        brand:product.brand.name,
        category:product.category.name,
    }
}
//controller

const getProductsPage = async (req, res) => {
    try {
        const user = req.user||null;
        const {brands,categories,
            sortField,sortOrder,
            page=1,rowsPerPage=ROW_PER_PAGE,
            priceRange=[]}=getQueryParams(req);
        const {onSales}=req.query;
        const {search}=req.query;
        let products=[];
        products=await productService.getProductsFromElastic(search,{brands, categories, sortField, sortOrder,priceRange });
        if(onSales==='true'){
            products=products.filter((product)=>product.salePrice>0);
        }
        const totalProducts=products.length;
        if(page && rowsPerPage){
            products=products.slice((page-1)*rowsPerPage,page*rowsPerPage);
        }
        const productsInCart = await cartService.coutProductInCart(user?user._id:null);
        return res.render('products', {
            products: products.map(populateProduct),
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
            priceRange=[]}=getQueryParams(req);
        const {onSales}=req.query;
        const {search}=req.query;
        let products=[];
        products=await productService.getProductsFromElastic(search,{brands, categories, sortField, sortOrder,priceRange });
        if(onSales==='true'){
            products=products.filter((product)=>product.salePrice>0);
        }
        const totalProducts=products.length;
        if(page && rowsPerPage){
            products=products.slice((page-1)*rowsPerPage,page*rowsPerPage);
        }
        return res.send({
            totalProducts,
            products:products.map(populateProduct),
        });
    }
    catch (e) {
        return res.json({
            data: e.message,
        });
    }
};

const apiGetSuggestedProducts=async (req,res)=>{
    try {
        const {search}=req.query;
        const products=await productService.getSuggestedProducts(search);
        return res.send(products);
    }
    catch (e) {
        console.log(e.message);
        return res.json({
            message:"There is an internal error",
        });
    }
};

const shopProductController={
    getProductsPage,
    apiGetProducts,
    apiGetSuggestedProducts,
};

export default shopProductController;