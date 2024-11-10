import mongoose, { Schema } from "mongoose";

const productSchema= new mongoose.Schema({
    type: {type: String, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true},
    salePrice:{
        type:Number,
    },
    brand: {type: String, required: true},
    totalStock:{type: Number,required:true},
    image:String,
    rating:{
        type:Number,
        default:0,
    },
});
//exptected receit an arr
productSchema.query.byType = function(types) {
    if (!types || types.length <= 0) return this;
    return this.where({ type: { $in: types.map(type => new RegExp(`^${type}$`, "i")) } });
};

productSchema.query.byBrand = function(brands) {
    if (!brands || brands.length <= 0) return this;
    return this.where({
        brand: { $in: brands.map(brand => new RegExp(`^${brand}$`, "i")) }
    });
};


productSchema.index({name:'text',brand:'text',type:'text'});

const Product=mongoose.model('Product',productSchema);
export default Product;