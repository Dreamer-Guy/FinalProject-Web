import serviceFactory from "../Factory/serviceFactory.js";

const categoryService = serviceFactory.getCategoryService();
const productPropertyService = serviceFactory.getProductPropertyService();

const getCategoryProperties = async (req, res) => {
    try {
        const properties = await productPropertyService.getPropertiesByCategoryId(req.params.categoryId);
        res.json(properties);
    } catch (error) {
        console.error('Error fetching category properties:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { getCategoryProperties };