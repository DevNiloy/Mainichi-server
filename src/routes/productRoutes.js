const express = require("express");
const router = express.Router();
const {
  getCategoriesWithSubs,
  getProducts,
  getFeatured,
  getProductBySlug,
} = require("../controllers/productController");

/**
 * @swagger
 * /products/categories:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all categories with subcategories
 *     responses:
 *       200:
 *         description: List of categories with subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/categories", getCategoriesWithSubs);

/**
 * @swagger
 * /products/details/{slug}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product details by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         example: biryani-chicken
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get("/details/:slug", getProductBySlug);

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get products with filtering and pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product title
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: subCategory
 *         schema:
 *           type: string
 *         description: Filter by subcategory ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of products with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     limit:
 *                       type: integer
 */
router.get("/", getProducts);

/**
 * @swagger
 * /products/featured:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get featured/best-seller products
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *     responses:
 *       200:
 *         description: Featured products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get("/featured", getFeatured);

// Details (Image 4)

module.exports = router;
