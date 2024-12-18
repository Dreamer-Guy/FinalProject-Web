import serviceFactory from "../../Factory/serviceFactory.js";

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

const getCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const rowPerPage = parseInt(req.query.rowPerPage) || 10;
        const sort = req.query.sort || 'createdAt-desc';

        const [sortField, sortOrder] = sort.split('-');
        const sortOptions = {
            [sortField]: sortOrder === 'desc' ? -1 : 1
        };

        const skip = (page - 1) * rowPerPage;

        const totalCategories = await categoryService.countAll();
        const categories = await categoryService.getPaginated({
            skip,
            limit: rowPerPage,
            sort: sortOptions
        });

        res.json({
            categories,
            totalCategories,
            currentPage: page
        });
    } catch (error) {
        console.error('Error in getCategories:', error);
        res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
};

const getCategoryPage = async (req, res) => {
    try {
        const user = req.user || null;
        res.render('admin/categories', {
            user,
            activePage: 'categories'
        });
    } catch (error) {
        console.error('Error in getCategoryPage:', error);
        res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
};

export { getCategoryProperties, getCategories, getCategoryPage };