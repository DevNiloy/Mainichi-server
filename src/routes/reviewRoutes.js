const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /product/review/{id}/reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Add product review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Amazing product!
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid data or already reviewed
 *       401:
 *         description: Unauthorized
 */
// Product ID dhore review POST hobe
router.post("/:id/reviews", protect, reviewController.createProductReview);

module.exports = router;
