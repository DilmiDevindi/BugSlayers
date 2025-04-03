const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// Register User
const registerUser = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email. Please try again.",
            });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName,
            email,
            password: hashPassword,
        });

        await newUser.save();
        return res.status(201).json({
            success: true,
            message: "Registration successful",
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "An error occurred during registration",
        });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const checkUser = await User.findOne({ email });
        if (!checkUser) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please register first.",
            });
        }

        // Check password
        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
        if (!checkPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password. Please try again.",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: checkUser.id, role: checkUser.role, email: checkUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "60m" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Ensure security in production
            sameSite: "Strict",
        });

        return res.json({
            success: true,
            message: "Logged in successfully",
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser.id,
            },
            token,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "An error occurred during login",
        });
    }
};

// Logout User
const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    return res.json({
        success: true,
        message: "Logged out successfully",
    });
};

// Authentication Middleware
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user",
        });
    }
};

module.exports = { registerUser, loginUser, logout, authMiddleware };
