const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /order/place-order:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Place a new order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderItems
 *               - shippingAddress
 *               - totalPrice
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     qty:
 *                       type: number
 *                     image:
 *                       type: string
 *                     price:
 *                       type: number
 *                     product:
 *                       type: string
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   phone:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *                 default: COD
 *               totalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Cart is empty or invalid data
 *       401:
 *         description: Unauthorized
 */
router.post("/place-order", protect, orderController.placeOrder);

module.exports = router;
