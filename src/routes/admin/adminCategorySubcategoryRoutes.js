const express = require("express");
const router = express.Router();
const upload = require("../../config/multer");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  deleteSubCategory,
  getNestedCategories,
} = require("../../controllers/admin/adminCategoryController");

// Categories

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     tags:
 *       - Admin Categories
 *     summary: Create a new category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router.post("/", upload.single("image"), createCategory);

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     tags:
 *       - Admin Categories
 *     summary: Get all categories with subcategories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories with subcategories
 */
router.get("/", upload.single("image"), getNestedCategories);

/**
 * @swagger
 * /admin/categories/{id}:
 *   put:
 *     tags:
 *       - Admin Categories
 *     summary: Update category
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
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put("/:id", upload.single("image"), updateCategory);

/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     tags:
 *       - Admin Categories
 *     summary: Delete category
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
 *         description: Category deleted successfully
 */
router.delete("/:id", deleteCategory);

// Sub-Categories

/**
 * @swagger
 * /admin/categories/subcategories:
 *   post:
 *     tags:
 *       - Admin Categories
 *     summary: Create subcategory
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 */
router.post("/subcategories", upload.single("image"), createSubCategory);

/**
 * @swagger
 * /admin/categories/subcategories/{id}:
 *   delete:
 *     tags:
 *       - Admin Categories
 *     summary: Delete subcategory
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
 *         description: Subcategory deleted successfully
 */
router.delete("/subcategories/:id", deleteSubCategory);

module.exports = router;
