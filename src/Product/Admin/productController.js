import serviceFactory from "../../Factory/serviceFactory.js";
import mongoose from "mongoose";

const productService = serviceFactory.getProductSerVice();
const categoryService = serviceFactory.getCategoryService();
const brandService = serviceFactory.getBrandService();
const ROW_PER_PAGE = 10;

const formatSortParam = (req) => {
    const sort = req.query.sort || "price-asc";
    const [sortField, sortOrder] = sort.split('-');
    return {
        sortField,
        sortOrder: sortOrder === 'asc' ? 1 : -1
    };
};

const formatFilterParam = (req) => {
    const { categories = "", brands = "" } = req.query;
    return {
        categories: categories ? categories.split(',').map(cat => cat.toLowerCase()) : [],
        brands: brands ? brands.split(',').map(brand => brand.toLowerCase()) : []
    };
};

const formatPriceParam = (req) => {
    const { minPrice, maxPrice } = req.query;
    const priceRange = [];
    
    if (minPrice || maxPrice) {
        priceRange.push({
            minPrice: minPrice ? Number(minPrice) : 0,
            maxPrice: maxPrice ? Number(maxPrice) : Number.MAX_VALUE
        });
    }
    
    return priceRange;
};

const getQueryParams = (req) => {
    const { page = 1, rowPerPage = ROW_PER_PAGE } = req.query;
    const { categories, brands } = formatFilterParam(req);
    const { sortField, sortOrder } = formatSortParam(req);
    const priceRange = formatPriceParam(req);

    return {
        brands,
        categories,
        sortField,
        sortOrder,
        page: Number(page),
        rowPerPage: Number(rowPerPage),
        priceRange
    };
};

const getProductPage = async (req, res) => {
    try {
        const user = req.user || null;
        const categories = await categoryService.getAll();
        const brands = await brandService.getAll();
        const products = await productService.getAll();
        
        res.render('admin/products', {
            user,
            categories,
            brands,
            totalProducts: products.length,
            ROW_PER_PAGE
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Internal server error"
        });    
    }
};

const getProductsApi = async (req, res) => {
    try {
        const { brands, categories, sortField, sortOrder, page, rowPerPage, priceRange } = getQueryParams(req);
        
        // console.log("Query params:", { brands, categories, priceRange });

        let products = await productService.getProducts({ 
            brands, 
            categories, 
            sortField, 
            sortOrder,
            priceRange 
        });

        const totalProducts = products.length;

        // Phân trang
        const paginatedProducts = products.slice(
            (page - 1) * rowPerPage,
            page * rowPerPage
        );

        return res.json({
            products: paginatedProducts,
            totalProducts,
            currentPage: page
        });
    } catch (error) {
        console.error("Error in getProductsApi:", error);
        return res.status(500).json({ 
            message: error.message 
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        
        const product = await productService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ 
                message: 'Product not found' 
            });
        }
        
        await productService.deleteByProductId(productId);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};

export { getProductPage, getProductsApi, deleteProduct };