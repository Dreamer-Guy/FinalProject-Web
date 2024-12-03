import mongoose from "mongoose";

const productPropertyValueSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    property_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductProperties',
        required: true,
    },
    value: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const ProductPropertyValue = mongoose.model('ProductPropertyValues', productPropertyValueSchema);

export default ProductPropertyValue;