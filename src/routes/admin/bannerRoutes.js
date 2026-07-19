const express = require("express");
const router = express.Router();
const bannerController = require("../../controllers/admin/bannerController");
const upload = require("../../config/multer");

/**
 * @swagger
 * /admin/banners:
 *   post:
 *     tags:
 *       - Admin Banners
 *     summary: Add banner slide
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Banner added successfully
 */
router.post("/", upload.single("image"), bannerController.addBanner);

/**
 * @swagger
 * /admin/banners:
 *   get:
 *     tags:
 *       - Admin Banners
 *     summary: Get all banners
 *     responses:
 *       200:
 *         description: List of all banners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Banner'
 */
router.get("/", bannerController.getBanners);

/**
 * @swagger
 * /admin/banners/{id}:
 *   delete:
 *     tags:
 *       - Admin Banners
 *     summary: Delete banner
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
 *         description: Banner deleted successfully
 */
router.delete("/:id", bannerController.deleteBanner);

module.exports = router;
