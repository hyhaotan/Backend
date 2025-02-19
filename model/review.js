import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    content: { type: String, required: true },
    img: { type: String, required: true }
});

export default mongoose.model('Review', reviewSchema);