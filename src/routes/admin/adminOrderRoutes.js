const express = require("express");
const router = express.Router();
const adminOrderController = require("../../controllers/admin/adminOrderController");

/**
 * @swagger
 * /admin/order:
 *   get:
 *     tags:
 *       - Admin Orders
 *     summary: Get all orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get("/", adminOrderController.getAllOrders);

/**
 * @swagger
 * /admin/order/{id}:
 *   get:
 *     tags:
 *       - Admin Orders
 *     summary: Get order details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
router.get("/:id", adminOrderController.getOrderDetails);

/**
 * @swagger
 * /admin/order/{id}:
 *   patch:
 *     tags:
 *       - Admin Orders
 *     summary: Update order status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Confirmed, Shipped, Delivered, Cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */
router.patch("/:id", adminOrderController.updateOrderStatus);

/**
 * @swagger
 * /admin/order/{id}:
 *   delete:
 *     tags:
 *       - Admin Orders
 *     summary: Delete order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Order deleted successfully
 */
router.delete("/:id", adminOrderController.deleteOrder);

module.exports = router;
