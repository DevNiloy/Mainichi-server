const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

let swaggerSpecs = {};
try {
  swaggerSpecs = require("./config/swagger-new");
} catch (error) {
  console.error("⚠️ Failed to load Swagger specs:", error.message);
}

// const dns = require("dns");
// dns.setServers(["1.1.1.1", "8.8.8.8"]);

const { notFound, errorHandler } = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");
const adminProductRoutes = require("../src/routes/admin/adminProductRoutes");
const categoryRoutes = require("./routes/admin/adminCategorySubcategoryRoutes");
const products = require("../src/routes/productRoutes");
const bannerRoute = require("../src/routes/admin/bannerRoutes");
const offerRoute = require("../src/routes/admin/offerRoutes");
const orderRoute = require("../src/routes/orderRoutes");
const adminOrderRoute = require("../src/routes/admin/adminOrderRoutes");
const reviewRoute = require("../src/routes/reviewRoutes");
const statsRoute = require("../src/routes/admin/adminStatsRoutes");
const userRoute = require("../src/routes/userRoutes");

const app = express();

// --- 1. CORS Middleware (Shobar upore thaka bhalo) ---
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5000",
      "https://api.mainichihalalshop.com",
      "https://mainichihalalshop.com",
      "https://www.mainichihalalshop.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

// --- 2. Standard Middlewares ---
app.use(cookieParser());
app.use(express.json()); // JSON body parse korar jonno
app.use(express.urlencoded({ extended: true })); // URL encoded data parse korar jonno (IMPORTANT)

// --- 3. Static Folder Setup ---
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

// --- 4. Test Route ---
app.get("/", (req, res) => {
  res.send("Japan Halal Food Server is running");
});

// --- 4.5 Swagger UI Documentation ---
if (Object.keys(swaggerSpecs).length > 0) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpecs, {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customCss: ".topbar { display: none }",
      customSiteTitle: "Halal Food API Documentation",
    }),
  );
  console.log("✅ Swagger UI available at /api-docs");
} else {
  console.warn("⚠️ Swagger specs not available");
}

// --- 5. Routes Integration ---
app.use("/api/auth", authRoutes);
app.use("/api/products", products);
app.use("/api/order", orderRoute); //order place
app.use("/api/product/review", reviewRoute); //review post kora
// Admin Routes
app.use("/api/user", userRoute); //all user and my order
app.use("/api/admin/products", adminProductRoutes); //products create
app.use("/api/admin/categories", categoryRoutes); //category create
app.use("/api/admin/banners", bannerRoute); // Eita ekhon unique
app.use("/api/admin/offers", offerRoute); //offer create kora
app.use("/api/admin/order", adminOrderRoute); //status change kora oder er + all order get kora
app.use("/api/admin/overview", statsRoute); //admin stats check

// --- 6. Error Handling ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
