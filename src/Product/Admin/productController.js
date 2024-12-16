import serviceFactory from "../../Factory/serviceFactory.js";

const productService = serviceFactory.getProductSerVice();

const getProductPage = async (req, res) => {
    try {
        const user = req.user || null;
        
        res.render('admin/products', {
            user,
        })
    } catch (e) {
        console.log(e);
        
        return res.json({
            data: null,
        });    
    }
}

export { getProductPage };