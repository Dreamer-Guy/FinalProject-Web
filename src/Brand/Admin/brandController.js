import serviceFactory from "../../Factory/serviceFactory.js";

const brandService = serviceFactory.getBrandService();

const getBrands = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const rowPerPage = parseInt(req.query.rowPerPage) || 10;
        const sort = req.query.sort || 'createdAt-desc';

        const [sortField, sortOrder] = sort.split('-');
        const sortOptions = {
            [sortField]: sortOrder === 'desc' ? -1 : 1
        };

        const skip = (page - 1) * rowPerPage;

        const [brands, totalBrands] = await Promise.all([
            brandService.getPaginated({
                skip,
                limit: rowPerPage,
                sort: sortOptions
            }),
            brandService.countAll()
        ]);

        res.json({
            brands,
            currentPage: page,
            totalBrands,
            totalPages: Math.ceil(totalBrands / rowPerPage)
        });
    } catch (error) {
        console.error('Error in getBrands:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getBrandPage = async (req, res) => {
    try {
        const user = req.user || null;
        res.render('admin/brand', {
            user
        });
    } catch (error) {
        console.error('Error in getBrandPage:', error);
        res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
};

const addBrand = async (req, res) => {
    try {
        const { name } = req.body;
        
        const existingBrand = await brandService.findByName(name);
        if (existingBrand) {
            return res.status(400).json({ message: 'Brand already exists' });
        }

        const newBrand = await brandService.create({ name });
        
        res.status(201).json({
            message: 'Brand created successfully',
            brand: newBrand
        });
    } catch (error) {
        console.error('Error in addBrand:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAddBrandPage = async (req, res) => {
    try {
        const user = req.user || null;
        res.render('admin/addBrand', {
            user
        });
    } catch (error) {
        console.error('Error in getAddBrandPage:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { getBrands, getBrandPage, addBrand, getAddBrandPage };
