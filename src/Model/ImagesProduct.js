import mongoose from "mongoose";

const imagesProductSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    images:[
        {
            type: String,
            default: "",
        }
    ]
});

    
const ImagesProduct = mongoose.model("ImageProduct", imagesProductSchema);
export default ImagesProduct;