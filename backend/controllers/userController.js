import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register user
export const registerUser = async (req, res) => {
    const { name, password, email, role } = req.body;
    
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        const user = await newUser.save();
        const token = createToken(user._id, user.role);
        
        res.status(201).json({ 
            success: true, 
            token, 
            user: { 
                _id: user._id,
                name: user.name, 
                email: user.email, 
                role: user.role 
            } 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User doesn't exist" });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: "Account is deactivated" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id, user.role);
        res.json({ 
            success: true, 
            token, 
            user: { 
                _id: user._id,
                name: user.name, 
                email: user.email, 
                role: user.role 
            } 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await userModel.find({}).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 });
        const total = await userModel.countDocuments();

        res.json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
};

// Get single user (Admin only)
export const getUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching user" });
    }
};

// Add user by Admin (Admin only)
export const addUser = async (req, res) => {
    const { name, email, password, role, isActive } = req.body;
    
    try {
        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            role: role || 'user',
            isActive: isActive !== undefined ? isActive : true
        });

        const user = await newUser.save();
        
        res.status(201).json({ 
            success: true, 
            message: "User created successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error creating user" });
    }
};

// Update user (Admin only)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role, isActive } = req.body;

        const user = await userModel.findById(id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if email is being changed and if it's already in use
        if (email && email !== user.email) {
            const emailExists = await userModel.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ success: false, message: "Email already in use" });
            }
        }

        const updateData = {
            name: name || user.name,
            email: email || user.email,
            role: role || user.role,
            isActive: isActive !== undefined ? isActive : user.isActive
        };

        // Update password if provided
        if (password && password.length >= 8) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        await userModel.findByIdAndUpdate(id, updateData);

        res.json({ success: true, message: "User updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error updating user" });
    }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await userModel.findById(id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Don't allow deleting yourself
        if (id === req.body.userId) {
            return res.status(400).json({ success: false, message: "Cannot delete your own account" });
        }

        await userModel.findByIdAndDelete(id);

        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error deleting user" });
    }
};

// Search users (Admin only)
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!query) {
            return res.status(400).json({ success: false, message: "Search query is required" });
        }

        const users = await userModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('-password').skip(skip).limit(limit);

        const total = await userModel.countDocuments({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        });

        res.json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error searching users" });
    }
};

export { loginUser as login };