const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Halal Food Shop API",
      version: "1.0.0",
      description:
        "Complete API documentation for Halal Food Shop backend server",
      contact: {
        name: "Support Team",
        email: "support@mainichihalalshop.com",
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://api.mainichihalalshop.com/api"
            : "http://localhost:5000/api",
        description:
          process.env.NODE_ENV === "production" ? "Production" : "Development",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            image: { type: "string" },
            role: { type: "string" },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            price: { type: "number" },
            images: { type: "array", items: { type: "string" } },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string" },
            totalPrice: { type: "number" },
            status: { type: "string" },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "../routes/authRoutes.js"),
    path.join(__dirname, "../routes/productRoutes.js"),
    path.join(__dirname, "../routes/orderRoutes.js"),
    path.join(__dirname, "../routes/reviewRoutes.js"),
    path.join(__dirname, "../routes/userRoutes.js"),
    path.join(__dirname, "../routes/admin/adminProductRoutes.js"),
    path.join(__dirname, "../routes/admin/adminCategorySubcategoryRoutes.js"),
    path.join(__dirname, "../routes/admin/bannerRoutes.js"),
    path.join(__dirname, "../routes/admin/offerRoutes.js"),
    path.join(__dirname, "../routes/admin/adminOrderRoutes.js"),
    path.join(__dirname, "../routes/admin/adminStatsRoutes.js"),
  ],
};

let specs = {};
try {
  specs = swaggerJsdoc(options);
  console.log("✅ Swagger specs generated successfully");
} catch (error) {
  console.error("⚠️ Swagger error (serving basic docs):", error.message);
  specs = {
    openapi: "3.0.0",
    info: { title: "API", version: "1.0.0" },
    paths: {},
  };
}

module.exports = specs;
