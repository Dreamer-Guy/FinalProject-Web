import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGOOSE_DB_URL;
await mongoose.connect(uri).then(()=>{
    console.log(`Connected to MongoDB `);
});

export default mongoose;
