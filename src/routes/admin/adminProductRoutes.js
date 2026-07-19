const express = require("express");
const router = express.Router();
const upload = require("../../config/multer");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} = require("../../controllers/admin/adminProductController");

/**
 * @swagger
 * /admin/products:
 *   post:
 *     tags:
 *       - Admin Products
 *     summary: Create a new product
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
 *               - desc
 *               - price
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               desc:
 *                 type: string
 *               price:
 *                 type: number
 *               discountPrice:
 *                 type: number
 *               category:
 *                 type: string
 *               subCategory:
 *                 type: string
 *               stock:
 *                 type: string
 *                 enum: [available, "out of stock"]
 *               stockQuantity:
 *                 type: number
 *               bestSeller:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", upload.array("images", 10), createProduct);

/**
 * @swagger
 * /admin/products/{id}:
 *   get:
 *     tags:
 *       - Admin Products
 *     summary: Get product by ID
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
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /admin/products/{id}:
 *   put:
 *     tags:
 *       - Admin Products
 *     summary: Update product
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               desc:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put("/:id", upload.array("images", 10), updateProduct);

/**
 * @swagger
 * /admin/products/{id}:
 *   delete:
 *     tags:
 *       - Admin Products
 *     summary: Delete product
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
 *         description: Product deleted successfully
 */
router.delete("/:id", deleteProduct);

module.exports = router;
