const User = require("../models/user");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// ==========================================
// GET ALL USERS
// ==========================================

const getUsers = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          {
            name: {
              $regex: search,
              $options: "i",
            },
          },
          {
            email: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      };
    }

    const users = await User.find(query).select("-password");

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log("Get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get users",
    });
  }
};

// ==========================================
// GET DASHBOARD STATISTICS
// ==========================================

const getDashboardStats = async (req, res) => {
  try {
    // Count all users
    const totalUsers = await User.countDocuments();

    // Count admin users
    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    // Count regular users
    const totalRegularUsers = await User.countDocuments({
      role: "user",
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalRegularUsers,
      },
    });
  } catch (error) {
    console.log("Get dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get dashboard statistics",
    });
  }
};

// ==========================================
// CREATE USER
// ==========================================

const createUser = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    if (name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    if (role && !["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Create user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};

// ==========================================
// UPDATE USER
// ==========================================

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email and role are required",
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: id },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    user.name = name.trim();
    user.email = normalizedEmail;
    user.role = role;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Update user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

// ==========================================
// DELETE USER
// ==========================================

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Prevent self deletion
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting the last admin
    if (user.role === "admin") {
      const adminCount = await User.countDocuments({
        role: "admin",
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete the last admin",
        });
      }
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("Delete user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getDashboardStats,
};