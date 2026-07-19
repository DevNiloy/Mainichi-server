const swaggerJsdoc = require("swagger-jsdoc");const path = require('path');
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
        url: "http://localhost:5000/api",
        description: "Development Server",
      },
      {
        url: "https://mainichihalalshop.com/api",
        description: "Production Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT Authorization header using the Bearer scheme",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            image: {
              type: "string",
              example: "https://i.ibb.co/L8N81pX/default-avatar.png",
            },
            role: { type: "string", enum: ["USER", "ADMIN"], example: "USER" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            title: { type: "string", example: "Biryani" },
            slug: { type: "string", example: "biryani-chicken" },
            desc: { type: "string", example: "Delicious biryani" },
            price: { type: "number", example: 350 },
            discountPrice: { type: "number", example: 300 },
            images: { type: "array", items: { type: "string" } },
            category: { type: "string", example: "507f1f77bcf86cd799439011" },
            subCategory: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            stock: {
              type: "string",
              enum: ["available", "out of stock"],
              example: "available",
            },
            stockQuantity: { type: "number", example: 100 },
            bestSeller: { type: "boolean", example: true },
            purchaseCount: { type: "number", example: 50 },
            ratings: {
              type: "object",
              properties: {
                average: { type: "number", example: 4.5 },
                count: { type: "number", example: 10 },
              },
            },
            reviews: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  user: { type: "string" },
                  name: { type: "string" },
                  rating: { type: "number" },
                  comment: { type: "string" },
                  createdAt: { type: "string", format: "date-time" },
                },
              },
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Category: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            name: { type: "string", example: "Biryani" },
            slug: { type: "string", example: "biryani" },
            image: { type: "string", example: "https://example.com/image.jpg" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            user: { type: "string", example: "507f1f77bcf86cd799439011" },
            orderItems: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Biryani" },
                  qty: { type: "number", example: 2 },
                  image: { type: "string" },
                  price: { type: "number", example: 350 },
                  product: {
                    type: "string",
                    example: "507f1f77bcf86cd799439011",
                  },
                },
              },
            },
            shippingAddress: {
              type: "object",
              properties: {
                address: { type: "string", example: "123 Main Street" },
                city: { type: "string", example: "Dhaka" },
                postalCode: { type: "string", example: "1212" },
                phone: { type: "string", example: "01712345678" },
              },
            },
            paymentMethod: { type: "string", example: "COD" },
            totalPrice: { type: "number", example: 700 },
            status: {
              type: "string",
              enum: [
                "Pending",
                "Confirmed",
                "Shipped",
                "Delivered",
                "Cancelled",
              ],
              example: "Pending",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Banner: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            title: { type: "string", example: "Welcome" },
            subtitle: { type: "string", example: "Fresh Halal Food" },
            image: { type: "string", example: "/uploads/banners/banner.jpg" },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Offer: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            text: {
              type: "string",
              example: "Get 20% off on orders above 500 BDT",
            },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            status: { type: "number", example: 200 },
            message: { type: "string", example: "Success message" },
            data: { type: "object" },
          },
        },
      },
    },
  },
  apis: [
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../routes/admin/*.js')
  ],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
