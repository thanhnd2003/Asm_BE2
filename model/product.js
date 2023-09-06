import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
    name: String || Number,
    price: Number,
    desc: String,
    img: String,
    cate: Number
})

export default mongoose.model("Product", productSchema)