import serviceFactory from "../../Factory/serviceFactory.js";
import mongoose from "mongoose";
import uploadImage from "../../utils/uploadImage.js";
import fs from "fs-extra";
import exp from "constants";

const productService = serviceFactory.getProductSerVice();
const categoryService = serviceFactory.getCategoryService();
const brandService = serviceFactory.getBrandService();
const productPropertyService = serviceFactory.getProductPropertyService();
const imagesProductService=serviceFactory.getImagesProductService();
const ROW_PER_PAGE = 10;

const formatSortParam = (req) => {
    const sort = req.query.sort || "price-asc";
    const [sortField, sortOrder] = sort.split('-');
    
    if (sortField === 'price') {
        return {
            sortField: 'salePrice',
            sortOrder: sortOrder === 'asc' ? 1 : -1
        };
    }
    
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
        
        res.render('admin/Product/products', {
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
        
        await productService.softDelete(productId);
        
        res.json({ 
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteProduct:', error);
        res.status(500).json({ 
            message: 'Error deleting product'
        });
    }
};

const getProductDetail = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productService.getProductById(productId);
        
        if (!product) {
            return res.redirect('/admin/Product/products');
        }
        
        const productProperties = await productPropertyService.getProductPropertiesByProductId(productId);
        const categoryProperties = await productPropertyService.getPropertiesByCategoryId(product.category_id);

        const user = req.user || null;
        res.render('admin/Product/productDetail', {
            user,
            product,
            productProperties,
            categoryProperties
        });

    } catch (error) {
        console.error(error);
        res.redirect('/admin/Product/products');
    }
};

const getAddProductPage = async (req, res) => {
    try {
        const categories = await categoryService.getAll();
        const brands = await brandService.getAll();
        const user = req.user || null;
        
        res.render('admin/Product/addProduct', {
            user,
            categories,
            brands
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/Product/products');
    }
};

const addProduct = async (req, res) => {
    try {
        const productData = req.body;
        
        if (!productData.name || !productData.price) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newProduct = {
            name: productData.name,
            price: Number(productData.price),
            salePrice: Number(productData.salePrice) || 0,
            totalStock: Number(productData.totalStock) || 0,
            image: productData.image,
            description: productData.description,
            category_id: productData.category_id,
            brand_id: productData.brand_id,
            rating: 0,
            numReviews: 0,
            status: 'On stock'
        };
        const imagesProduct=productData.imagesProduct;
        const savedProduct = await productService.create(newProduct);
        await imagesProductService.updateAlternativeImagesOfProductAndInsertIfNotExist(savedProduct._id.toString(),imagesProduct);

        if (productData.properties) {
            await productPropertyService.saveProductPropertiesorProduct(
                Object.entries(productData.properties).map(([propertyId, value]) => ({
                    product_id: savedProduct._id,
                    property_id: propertyId,
                    value: value
                }))
            );
        }

        res.status(201).json({ 
            message: 'Product created successfully',
            product: savedProduct 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product' });
    }
};

const uploadProductImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const imageUrl = await uploadImage(req.file.path);
        
        await fs.unlink(req.file.path);

        if (!imageUrl) {
            return res.status(500).json({ message: "Failed to upload image" });
        }
        res.json({ imageUrl });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Error uploading image" });
    }
};

const getEditProductPage = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productService.getProductById(productId);
        
        if (!product) {
            return res.redirect('/admin/Product/products');
        }
        
        const categories = await categoryService.getAll();
        const brands = await brandService.getAll();
        const productProperties = await productPropertyService.getProductPropertiesByProductId(productId);
        const categoryProperties = await productPropertyService.getPropertiesByCategoryId(product.category_id);
        const alternativeImages=await imagesProductService.getAllAlternativeImagesOfProduct(productId)||[];
        const user = req.user || null;
        res.render('admin/Product/editProduct', {
            user,
            product,
            categories,
            brands,
            productProperties,
            categoryProperties,
            alternativeImages,
        });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/Product/products');
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const productData = req.body;
        
        if (!productData.name || !productData.price) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const updatedProduct = {
            name: productData.name,
            price: Number(productData.price),
            salePrice: Number(productData.salePrice) || 0,
            totalStock: Number(productData.totalStock) || 0,
            image: productData.image,
            description: productData.description,
            category_id: productData.category_id,
            brand_id: productData.brand_id,
            status: productData.status
        };

        const imagesProduct=productData.imagesProduct;

        await imagesProductService.updateAlternativeImagesOfProductAndInsertIfNotExist(productId,imagesProduct);
        await productService.updateByProductId(productId, updatedProduct);
        
        if (productData.properties) {
            await productPropertyService.updateProductProperTiesByProductId(
                productId,
                Object.entries(productData.properties).map(([propertyId, value]) => ({
                    property_id: propertyId,
                    value: value
                }))
            );
        }

        res.status(200).json({ 
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

const restoreProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await productService.restoreProduct(productId);
        
        res.json({ 
            message: 'Product restored successfully'
        });
    } catch (error) {
        console.error('Error in restoreProduct:', error);
        res.status(500).json({ 
            message: 'Error restoring product'
        });
    }
};

const getDeletedProductsPage = async (req, res) => {
    try {
        const user = req.user || null;
        const categories = await categoryService.getAll();
        const brands = await brandService.getAll();
        
        res.render('admin/Product/deletedProducts', {
            user,
            categories,
            brands
        });
    } catch (error) {
        console.error('Error in getDeletedProductsPage:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getDeletedProductsApi = async (req, res) => {
    try {
        const queryParams = getQueryParams(req);
        const { 
            brands, categories, sortField, 
            sortOrder, page, rowPerPage, priceRange 
        } = queryParams;

        let products = await productService.getDeletedProducts({ 
            brands, 
            categories, 
            sortField, 
            sortOrder,
            priceRange 
        });

        const totalProducts = products.length;

        // Phân trang sau khi đã filter
        const paginatedProducts = products.slice(
            (page - 1) * rowPerPage,
            page * rowPerPage
        );

        return res.json({
            products: paginatedProducts,
            totalProducts,
            currentPage: page
        });
    } 
    catch (error) {
        console.error('Error in getDeletedProductsApi:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const adminProductController = {
    getProductPage,
    getProductsApi,
    deleteProduct,
    getProductDetail,
    getAddProductPage,
    addProduct,
    uploadProductImage,
    getEditProductPage,
    updateProduct,
    restoreProduct,
    getDeletedProductsPage,
    getDeletedProductsApi
};

export default adminProductController;