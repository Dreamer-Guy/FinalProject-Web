import serviceFactory from "../../Factory/serviceFactory.js";
import Product from "../../Model/Product.js";

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

const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        const existingBrand = await brandService.findByNameExcept(name, id);
        if (existingBrand) {
            return res.status(400).json({ message: 'Brand name already exists' });
        }

        const updatedBrand = await brandService.updateById(id, { name });
        
        if (!updatedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        
        res.json({
            message: 'Brand updated successfully',
            brand: updatedBrand
        });
    } catch (error) {
        console.error('Error in updateBrand:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        await brandService.softDeleteBrand(id);
        res.json({ message: 'Brand deleted successfully' });
    } catch (error) {
        console.error('Error in deleteBrand:', error);
        res.status(error.message.includes('not found') ? 404 : 400)
           .json({ message: error.message });
    }
};

const adminBrandController={
    getBrands,
    getBrandPage,
    addBrand,
    getAddBrandPage,
    updateBrand,
    deleteBrand
}
export default adminBrandController;
