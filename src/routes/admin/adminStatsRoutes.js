const express = require("express");
const router = express.Router();
const adminStatsController = require("../../controllers/admin/adminStatsController");

/**
 * @swagger
 * /admin/overview/summary:
 *   get:
 *     tags:
 *       - Admin Stats
 *     summary: Get dashboard statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics and overview
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalOrders:
 *                       type: number
 *                     totalRevenue:
 *                       type: number
 *                     totalUsers:
 *                       type: number
 *                     totalProducts:
 *                       type: number
 *                     ordersByStatus:
 *                       type: object
 *                     monthlyRevenue:
 *                       type: array
 *                     topSellingProducts:
 *                       type: array
 */
router.get("/summary", adminStatsController.getDashboardSummary);

module.exports = router;
