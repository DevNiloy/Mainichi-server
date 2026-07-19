# Halal Food Shop - Backend API Documentation

## 📚 Documentation Files

This API comes with three comprehensive documentation files:

1. **API_DOCUMENTATION.md** - Complete endpoint reference with detailed examples
2. **API_QUICK_REFERENCE.md** - Quick lookup guide with tables and examples
3. **Halal_Food_API_Postman_Collection.json** - Postman collection for testing

---

## 🚀 Getting Started

### Prerequisites

- Node.js v14+
- MongoDB local or connection string
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# PORT=5000
# DB_URI=mongodb://localhost:27017/halal-food
# JWT_SECRET=your_secret_key
# NODE_ENV=development

# Start development server
npm run dev

# Or start production server
npm start
```

### Server runs on

```
http://localhost:5000
```

---

## 📖 API Overview

### Base URL

```
http://localhost:5000/api
```

### Authentication

- Uses **JWT (JSON Web Tokens)**
- Tokens sent via httpOnly cookies
- Valid for **7 days**
- Include in Authorization header for protected endpoints:
  ```
  Authorization: Bearer <token>
  ```

### Response Format

All responses follow standard JSON format with `success`, `status`, `message`, and `data` fields.

---

## 🔑 Key Endpoints

### Authentication (6 endpoints)

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user profile
- `PUT /auth/update-me` - Update profile
- `DELETE /auth/me/delete` - Delete account
- `POST /auth/logout` - Logout

### Products (4 endpoints)

- `GET /products/categories` - Get all categories
- `GET /products/` - Get products with filtering
- `GET /products/featured` - Get featured products
- `GET /products/details/:slug` - Get product details

### Orders (1 endpoint)

- `POST /order/place-order` - Place new order

### Reviews (1 endpoint)

- `POST /product/review/:id/reviews` - Add product review

### User (2 endpoints)

- `GET /user/my-orders` - Get user's orders
- `GET /user/all-user` - Get all users (admin)

### Admin Products (4 endpoints)

- `POST /admin/products/` - Create product
- `GET /admin/products/:id` - Get product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product

### Admin Categories (6 endpoints)

- `POST /admin/categories/` - Create category
- `GET /admin/categories/` - Get categories
- `PUT /admin/categories/:id` - Update category
- `DELETE /admin/categories/:id` - Delete category
- `POST /admin/categories/subcategories` - Create subcategory
- `DELETE /admin/categories/subcategories/:id` - Delete subcategory

### Admin Banners (3 endpoints)

- `POST /admin/banners/` - Add banner
- `GET /admin/banners/` - Get banners
- `DELETE /admin/banners/:id` - Delete banner

### Admin Offers (2 endpoints)

- `POST /admin/offers/` - Update offer
- `GET /admin/offers/` - Get offer

### Admin Orders (4 endpoints)

- `GET /admin/order/` - Get all orders
- `GET /admin/order/:id` - Get order details
- `PATCH /admin/order/:id` - Update order status
- `DELETE /admin/order/:id` - Delete order

### Admin Stats (1 endpoint)

- `GET /admin/overview/summary` - Get dashboard stats

**Total: 30+ endpoints**

---

## 📊 Data Models

### User

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  image: String,
  role: String (USER | ADMIN),
  createdAt: Date,
  updatedAt: Date
}
```

### Product

```javascript
{
  _id: ObjectId,
  title: String,
  slug: String (auto-generated),
  desc: String,
  price: Number,
  discountPrice: Number,
  images: [String],
  category: ObjectId (ref: Category),
  subCategory: ObjectId (ref: SubCategory),
  stock: String,
  stockQuantity: Number,
  bestSeller: Boolean,
  purchaseCount: Number,
  ratings: { average: Number, count: Number },
  reviews: [{ user, name, rating, comment, createdAt }],
  createdAt: Date,
  updatedAt: Date
}
```

### Category

```javascript
{
  _id: ObjectId,
  name: String (unique),
  slug: String,
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Order

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  orderItems: [{ name, qty, image, price, product }],
  shippingAddress: { address, city, postalCode, phone },
  paymentMethod: String,
  totalPrice: Number,
  status: String (Pending | Confirmed | Shipped | Delivered | Cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

### Banner

```javascript
{
  _id: ObjectId,
  title: String,
  subtitle: String,
  image: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Offer

```javascript
{
  _id: ObjectId,
  text: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing with Postman

### Import Collection

1. Open Postman
2. Click **Import** → Choose **File**
3. Select `Halal_Food_API_Postman_Collection.json`
4. Collection will be imported with all endpoints

### Set up Environment Variables

1. In Postman, create new Environment
2. Add variables:
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: (will be filled after login)

### Login Flow

1. Run **Register User** or **Login User** request
2. Copy the `token` from response
3. In Postman, set environment variable `token` to the copied token
4. Now all protected endpoints will use this token automatically

---

## 🔍 Common Workflows

### User Registration & Login

```bash
1. POST /auth/register - Create new account
2. Copy token from response
3. Use token for authenticated requests
```

### Product Management (Admin)

```bash
1. POST /admin/categories/ - Create category
2. POST /admin/categories/subcategories - Create subcategory
3. POST /admin/products/ - Create product
4. GET /admin/products/:id - Get product
5. PUT /admin/products/:id - Update product
6. DELETE /admin/products/:id - Delete product
```

### Order Management (Admin)

```bash
1. GET /admin/order/ - View all orders
2. GET /admin/order/:id - View order details
3. PATCH /admin/order/:id - Update order status
4. DELETE /admin/order/:id - Delete order
```

### Customer Journey

```bash
1. POST /auth/register - Customer creates account
2. GET /products/ - Browse products
3. GET /products/details/:slug - View product details
4. POST /product/review/:id/reviews - Add review
5. POST /order/place-order - Place order
6. GET /user/my-orders - View own orders
```

---

## 🛠 Development Tips

### Error Handling

- All errors follow standard HTTP status codes
- Common errors: 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)
- Check error messages for detailed information

### Filtering Products

```bash
# Search
GET /api/products?search=biryani

# Price range
GET /api/products?minPrice=200&maxPrice=500

# Pagination
GET /api/products?page=1&limit=12

# Sorting
GET /api/products?sortBy=newest
```

### File Uploads

- Use `multipart/form-data` for file uploads
- Maximum 10 images per product
- Supported formats: jpg, jpeg, png, gif, webp

### Order Status Flow

```
Pending → Confirmed → Shipped → Delivered
   ↓
Cancelled (can be set from any state)
```

---

## 🔐 Security Features

✅ **Password Hashing** - bcryptjs with salt rounds 10
✅ **JWT Authentication** - Secure token-based auth
✅ **HTTP-Only Cookies** - Tokens not accessible via JavaScript
✅ **CORS Protection** - Restricted to allowed origins
✅ **CSRF Protection** - sameSite: strict cookie setting
✅ **Input Validation** - All inputs validated server-side
✅ **Role-Based Access** - USER and ADMIN roles

---

## 🚢 Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL certificates
- [ ] Set `secure: true` for cookies
- [ ] Configure database URI for production
- [ ] Update CORS origins to production domains
- [ ] Set strong JWT_SECRET
- [ ] Configure Cloudinary for image storage
- [ ] Set up email service (Nodemailer)
- [ ] Enable HTTPS redirects
- [ ] Set up monitoring and logging
- [ ] Configure database backups

---

## 📞 Support & Troubleshooting

### Common Issues

**401 Unauthorized**

- Token expired (7 days)
- Invalid token format
- Missing Authorization header
- Solution: Login again to get new token

**404 Not Found**

- Check endpoint path
- Verify resource ID exists
- Ensure correct HTTP method

**400 Bad Request**

- Missing required fields
- Invalid data types
- Duplicate entries
- Check error message for details

**CORS Error**

- Frontend not in allowed origins
- Check browser console
- Add frontend URL to CORS configuration

### Debug Mode

Set environment variable:

```bash
DEBUG=* npm run dev
```

---

## 📝 API Documentation Quick Links

- **Full Documentation**: See `API_DOCUMENTATION.md`
- **Quick Reference**: See `API_QUICK_REFERENCE.md`
- **Postman Collection**: Import `Halal_Food_API_Postman_Collection.json`

---

## 🔗 Project Structure

```
server/
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   ├── config/                # Configuration files
│   ├── controllers/           # Route handlers
│   ├── middlewares/           # Custom middlewares
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   └── utils/                 # Utility functions
├── public/                    # Static files
├── API_DOCUMENTATION.md       # Full API docs
├── API_QUICK_REFERENCE.md     # Quick reference
├── Halal_Food_API_Postman_Collection.json  # Postman collection
└── package.json
```

---

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ORM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **cloudinary** - Image storage
- **nodemailer** - Email service
- **cors** - Cross-origin handling
- **dotenv** - Environment variables
- **cookie-parser** - Cookie handling

---

## 📄 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_URI=mongodb://localhost:27017/halal-food

# JWT
JWT_SECRET=your_super_secret_key_here

# Cloudinary (Image Storage)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# CORS Origins
CORS_ORIGIN=http://localhost:5173,https://mainichihalalshop.com
```

---

## 🎯 Next Steps

1. **Review Full Documentation**: Read `API_DOCUMENTATION.md` for complete endpoint details
2. **Check Quick Reference**: Use `API_QUICK_REFERENCE.md` for quick lookups
3. **Import Postman Collection**: Test endpoints using `Halal_Food_API_Postman_Collection.json`
4. **Start Development**: Begin integrating API with frontend

---

## 📧 Contact & Support

For API-related questions or issues:

- Check the error messages returned by API
- Verify all required fields are provided
- Ensure JWT token is valid
- Check CORS configuration if frontend requests fail

---

**API Version**: 1.0.0  
**Last Updated**: July 19, 2026  
**Total Endpoints**: 30+  
**Documentation**: Complete ✅
