const express = require("express");

const router = express.Router();

const {
  getUsers,
  getDashboardStats,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");

const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

// ==========================================
// GET ALL USERS
// ==========================================

router.get(
  "/users",
  authMiddleware,
  authorize("admin"),
  getUsers
);

// ==========================================
// GET DASHBOARD STATISTICS
// ==========================================

router.get(
  "/stats",
  authMiddleware,
  authorize("admin"),
  getDashboardStats
);

// ==========================================
// CREATE USER
// ==========================================

router.post(
  "/users",
  authMiddleware,
  authorize("admin"),
  createUser
);

// ==========================================
// UPDATE USER
// ==========================================

router.put(
  "/users/:id",
  authMiddleware,
  authorize("admin"),
  updateUser
);

// ==========================================
// DELETE USER
// ==========================================

router.delete(
  "/users/:id",
  authMiddleware,
  authorize("admin"),
  deleteUser
);

module.exports = router;