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

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await productService.deleteByProductId(productId);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};

export { getProductPage, deleteProduct };