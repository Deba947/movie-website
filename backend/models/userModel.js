import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
    profileImage: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.models.user || mongoose.model("user", userSchema);
