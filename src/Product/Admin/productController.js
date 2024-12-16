import serviceFactory from "../../Factory/serviceFactory.js";

const productService = serviceFactory.getProductSerVice();
const ROW_PER_PAGE = 10; 

const getProductPage = async (req, res) => {
    try {
        const user = req.user || null;
        const page = parseInt(req.query.page) || 1;
        
        
        const products = await productService.getAll();
        const totalProducts = products.length;
        const paginatedProducts = products.slice((page-1)*ROW_PER_PAGE, page*ROW_PER_PAGE);

        res.render('admin/products', {
            user,
            products: paginatedProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts/ROW_PER_PAGE),
            totalProducts,
            ROW_PER_PAGE
        });
    } catch (e) {
        console.log(e);
        return res.json({
            data: null,
        });    
    }
}

const getProductsApi = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const rowPerPage = parseInt(req.query.rowPerPage) || ROW_PER_PAGE;
        const sort = req.query.sort || 'price-asc';
        
        let products = await productService.getProducts({});
        const totalProducts = products.length;
        
        products = products.sort((a, b) => {
            const priceA = a.salePrice > 0 ? a.salePrice : a.price;
            const priceB = b.salePrice > 0 ? b.salePrice : b.price;
            
            if(sort === 'price-asc') {
                return priceA - priceB;
            } else {
                return priceB - priceA; 
            }
        });
        
        const paginatedProducts = products.slice((page-1)*rowPerPage, page*rowPerPage);
        
        return res.json({
            products: paginatedProducts,
            totalProducts,
            currentPage: page
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
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