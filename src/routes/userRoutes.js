const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /user/my-orders:
 *   get:
 *     tags:
 *       - User
 *     summary: Get current user's orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 */
router.get("/my-orders", protect, userController.getMyOrders);

/**
 * @swagger
 * /user/all-user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/all-user", protect, userController.getAllUsers);

module.exports = router;
