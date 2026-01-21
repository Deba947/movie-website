import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: String,
    description: String,
    rating: Number,
    releaseDate: Date,
    duration: Number,
    genre: String,
    director: String,
    cast: [String],
    image: String,
    sceneImages: {
        type: [String],
        validate: v => v.length <= 6
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
}, { timestamps: true });

movieSchema.index({ title: "text", description: "text" });

export default mongoose.models.movie || mongoose.model("movie", movieSchema);
