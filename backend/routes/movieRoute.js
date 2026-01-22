import express from "express";
import {
  addMovie,
  listMovies,
  getSortedMovies,
  searchMovies,
  updateMovie,
  deleteMovie,
  getMovie
} from "../controllers/movieController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import upload from "../middleware/upload.js"; // CLOUDINARY

const movieRouter = express.Router();

//PUBLIC ROUTES 
movieRouter.get("/list", listMovies);
movieRouter.get("/sorted", getSortedMovies);
movieRouter.get("/search", searchMovies);
movieRouter.get("/:id", getMovie);

//ADMIN ROUTES 
movieRouter.post(
  "/add",
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "sceneImages", maxCount: 6 }
  ]),
  addMovie
);

movieRouter.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "sceneImages", maxCount: 6 }
  ]),
  updateMovie
);

movieRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteMovie
);

export default movieRouter;
