import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import movieRouter from "./routes/movieRoute.js";
import userRouter from "./routes/userRoute.js";
import path from "path";
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());


// Database connection
connectDB();

// API endpoints
app.use("/api/movies", movieRouter);
app.use("/api/user", userRouter);


app.get("/", (req, res) => {
    res.send("Movie API is Running");
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Something went wrong!" });
});

app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
