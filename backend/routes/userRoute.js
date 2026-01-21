import express from "express";
import {
  loginUser,
  registerUser,
  getUserProfile,
  getAllUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  searchUsers
} from "../controllers/userController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/profile", authMiddleware, getUserProfile);

userRouter.get("/list", authMiddleware, adminMiddleware, getAllUsers);
userRouter.get("/search", authMiddleware, adminMiddleware, searchUsers);
userRouter.post("/add", authMiddleware, adminMiddleware, addUser);
userRouter.get("/:id", authMiddleware, adminMiddleware, getUser);
userRouter.put("/:id", authMiddleware, adminMiddleware, updateUser);
userRouter.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

export default userRouter;
