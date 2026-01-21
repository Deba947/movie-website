import mongoose from "mongoose";

const queueSchema = new mongoose.Schema({
    operation: String,
    data: Object,
    status: { type: String, default: "pending" },
    retryCount: { type: Number, default: 0 },
    maxRetries: { type: Number, default: 3 },
    error: String
}, { timestamps: true });

export default mongoose.models.queue || mongoose.model("queue", queueSchema);
