const express = require("express");
const router = express.Router();
const offerController = require("../../controllers/admin/offerController");

/**
 * @swagger
 * /admin/offers:
 *   post:
 *     tags:
 *       - Admin Offers
 *     summary: Update offer text
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Offer updated successfully
 */
router.post("/", offerController.updateOffer);

/**
 * @swagger
 * /admin/offers:
 *   get:
 *     tags:
 *       - Admin Offers
 *     summary: Get current offer
 *     responses:
 *       200:
 *         description: Current offer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Offer'
 */
router.get("/", offerController.getOffer);

module.exports = router;
