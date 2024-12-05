import mongoose from "mongoose";

const productPropertySchema = new mongoose.Schema({
    category_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const ProductProperty = mongoose.model('ProductProperties', productPropertySchema);

export default ProductProperty;