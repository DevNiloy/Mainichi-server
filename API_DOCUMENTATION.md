# API Documentation - Halal Food Shop Server

## Table of Contents

1. [Overview](#overview)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [API Endpoints](#api-endpoints)
   - [Authentication Endpoints](#authentication-endpoints)
   - [Product Endpoints](#product-endpoints)
   - [Order Endpoints](#order-endpoints)
   - [Review Endpoints](#review-endpoints)
   - [User Endpoints](#user-endpoints)
   - [Admin Endpoints](#admin-endpoints)

---

## Overview

This is the API documentation for the **Halal Food Shop** backend server. The server provides RESTful endpoints for managing:

- User authentication and profiles
- Product catalog with categories and subcategories
- Shopping orders and order management
- Product reviews and ratings
- Admin dashboard for managing products, orders, banners, offers, and statistics

**Technology Stack:**

- Node.js with Express.js
- MongoDB with Mongoose
- Authentication: JWT (JSON Web Tokens)
- File Upload: Multer
- Email: Nodemailer
- Image Storage: Cloudinary

---

## Base URL

```
http://localhost:5000/api
https://mainichihalalshop.com/api
```

---

## Authentication

### JWT Token

The API uses JWT (JSON Web Tokens) for authentication. Tokens are sent via:

1. **Cookie** (httpOnly, 7 days expiry)
2. **Authorization Header** (Bearer token)

### Token Cookie Options

- `httpOnly: true` - Not accessible via JavaScript
- `secure: true` - HTTPS only in production
- `maxAge: 7 * 24 * 60 * 60 * 1000` - 7 days expiration
- `sameSite: strict` - CSRF protection

### Protected Endpoints

Endpoints marked with 🔒 require a valid JWT token.

---

## Data Models

### User Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  image: String (default avatar URL),
  role: String (enum: "USER", "ADMIN", default: "USER"),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model

```javascript
{
  _id: ObjectId,
  title: String (required),
  slug: String (unique, auto-generated from title),
  desc: String (required),
  price: Number (required),
  discountPrice: Number (default: 0),
  images: [String] (array of image URLs),
  category: ObjectId (ref: Category, required),
  subCategory: ObjectId (ref: SubCategory),
  stock: String (enum: "available", "out of stock", default: "available"),
  stockQuantity: Number (default: 0),
  bestSeller: Boolean (default: false),
  purchaseCount: Number (default: 0),
  ratings: {
    average: Number (default: 0),
    count: Number (default: 0)
  },
  reviews: [
    {
      user: ObjectId (ref: User),
      name: String,
      rating: Number,
      comment: String,
      createdAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model

```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  slug: String (unique, auto-generated from name),
  image: String (category image URL),
  createdAt: Date,
  updatedAt: Date
}
```

### SubCategory Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  slug: String (auto-generated),
  image: String (subcategory image URL),
  category: ObjectId (ref: Category, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model

```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, required),
  orderItems: [
    {
      name: String (required),
      qty: Number (required),
      image: String (required),
      price: Number (required),
      product: ObjectId (ref: Product, required)
    }
  ],
  shippingAddress: {
    address: String (required),
    city: String (required),
    postalCode: String (required),
    phone: String (required)
  },
  paymentMethod: String (default: "COD"),
  totalPrice: Number (required),
  status: String (enum: "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled", default: "Pending"),
  createdAt: Date,
  updatedAt: Date
}
```

### Banner Model

```javascript
{
  _id: ObjectId,
  title: String (required),
  subtitle: String,
  image: String (required, VPS path),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Offer Model

```javascript
{
  _id: ObjectId,
  text: String (required),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Handling

### Error Response Format

```javascript
{
  success: false,
  message: "Error description",
  status: 400 // HTTP status code
}
```

### Common HTTP Status Codes

| Status | Meaning                                 |
| ------ | --------------------------------------- |
| 200    | OK - Request successful                 |
| 201    | Created - Resource created successfully |
| 400    | Bad Request - Invalid parameters        |
| 401    | Unauthorized - Missing/invalid token    |
| 404    | Not Found - Resource not found          |
| 500    | Internal Server Error - Server error    |

### Common Error Messages

- `"Please enter all fields."` - Missing required fields
- `"User already exists"` - Email already registered
- `"Invalid credentials"` - Wrong email/password
- `"Product not found"` - Product ID doesn't exist
- `"Order not found"` - Order ID doesn't exist
- `"Cart is empty"` - No items in order

---

## API Endpoints

---

### Authentication Endpoints

#### 1. Register User

**POST** `/auth/register`

Public endpoint for user registration.

**Request Body:**

```javascript
{
  name: String (required),
  email: String (required, valid email format),
  password: String (required),
  image: String (optional, URL or base64)
}
```

**Response (201 Created):**

```javascript
{
  success: true,
  status: 201,
  message: "User registered successfully",
  user: {
    _id: ObjectId,
    name: String,
    email: String,
    image: String,
    role: String
  },
  token: String (JWT token)
}
```

**Error Responses:**

- `400` - Missing fields or email already exists
- `500` - Server error

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

---

#### 2. Login User

**POST** `/auth/login`

Public endpoint for user login.

**Request Body:**

```javascript
{
  email: String (required),
  password: String (required)
}
```

**Response (200 OK):**

```javascript
{
  success: true,
  status: 200,
  message: "Login successful",
  user: {
    _id: ObjectId,
    name: String,
    email: String,
    image: String,
    role: String
  },
  token: String (JWT token)
}
```

**Error Responses:**

- `400` - Missing email or password
- `401` - Invalid credentials

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

---

#### 3. Get Current User Profile 🔒

**GET** `/auth/me`

Protected endpoint to get logged-in user's profile.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  image: String,
  role: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Error Responses:**

- `401` - Unauthorized (invalid/missing token)
- `404` - User not found
- `500` - Server error

**cURL Example:**

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

---

#### 4. Update User Profile 🔒

**PUT** `/auth/update-me`

Protected endpoint to update user profile.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

```javascript
{
  name: String (optional),
  password: String (optional),
  image: File (optional, image file for upload)
}
```

**Response (200 OK):**

```javascript
{
  success: true,
  status: 200,
  message: "Profile updated successfully",
  user: {
    _id: ObjectId,
    name: String,
    email: String,
    image: String,
    role: String
  }
}
```

**Error Responses:**

- `400` - Invalid input
- `401` - Unauthorized
- `500` - Server error

**cURL Example:**

```bash
curl -X PUT http://localhost:5000/api/auth/update-me \
  -H "Authorization: Bearer <token>" \
  -F "name=John Updated" \
  -F "image=@/path/to/image.jpg"
```

---

#### 5. Delete User Account 🔒

**DELETE** `/auth/me/delete`

Protected endpoint to delete user account permanently.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```javascript
{
  message: "Account deleted successfully";
}
```

**Error Responses:**

- `401` - Unauthorized
- `500` - Server error

**Note:** This is a destructive operation and cannot be undone.

**cURL Example:**

```bash
curl -X DELETE http://localhost:5000/api/auth/me/delete \
  -H "Authorization: Bearer <token>"
```

---

#### 6. Logout User 🔒

**POST** `/auth/logout`

Protected endpoint to logout user (clears JWT cookie).

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```javascript
{
  message: "Logged out successfully";
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer <token>"
```

---

### Product Endpoints

#### 1. Get All Categories with Subcategories

**GET** `/products/categories`

Public endpoint to get all categories with their subcategories (for sidebar).

**Query Parameters:**

```
None
```

**Response (200 OK):**

```javascript
[
  {
    _id: ObjectId,
    name: String,
    slug: String,
    image: String,
    createdAt: Date,
    updatedAt: Date,
    subcategories: [
      {
        _id: ObjectId,
        name: String,
        slug: String,
        image: String,
        category: ObjectId,
      },
    ],
  },
];
```

**Error Responses:**

- `500` - Server error

**cURL Example:**

```bash
curl -X GET http://localhost:5000/api/products/categories
```

---

#### 2. Get Products (With Filters & Pagination)

**GET** `/products/`

Public endpoint to get products with filtering and pagination.

**Query Parameters:**

```
page: Number (default: 1)
limit: Number (default: 12)
search: String (search in title)
category: ObjectId (filter by category)
minPrice: Number (minimum price filter)
maxPrice: Number (maximum price filter)
sortBy: String (options: "newest", "price-low", "price-high", "popular")
```

**Response (200 OK):**

```javascript
{
  success: true,
  data: [
    {
      _id: ObjectId,
      title: String,
      slug: String,
      desc: String,
      price: Number,
      discountPrice: Number,
      images: [String],
      category: ObjectId,
      stock: String,
      ratings: {
        average: Number,
        count: Number
      },
      // ... other fields
    }
  ],
  meta: {
    totalCount: Number,
    totalPages: Number,
    currentPage: Number,
    limit: Number
  }
}
```

**Error Responses:**

- `500` - Server error

**cURL Example:**

```bash
curl -X GET "http://localhost:5000/api/products?page=1&limit=12&search=biryani&minPrice=100&maxPrice=1000"
```

---

#### 3. Get Featured Products

**GET** `/products/featured`

Public endpoint to get featured/best-seller products (homepage).

**Query Parameters:**

```
limit: Number (default: 8)
page: Number (default: 1)
```

**Response (200 OK):**

```javascript
{
  success: true,
  data: [
    {
      _id: ObjectId,
      title: String,
      slug: String,
      price: Number,
      discountPrice: Number,
      images: [String],
      bestSeller: Boolean,
      ratings: Object,
      // ... other fields
    }
  ]
}
```

**cURL Example:**

```bash
curl -X GET "http://localhost:5000/api/products/featured?limit=8"
```

---

#### 4. Get Product Details by Slug

**GET** `/products/details/:slug`

Public endpoint to get detailed information about a specific product.

**URL Parameters:**

```
slug: String (product slug)
```

**Response (200 OK):**

```javascript
{
  success: true,
  data: {
    _id: ObjectId,
    title: String,
    slug: String,
    desc: String,
    price: Number,
    discountPrice: Number,
    images: [String],
    category: {
      _id: ObjectId,
      name: String,
      slug: String
    },
    subCategory: {
      _id: ObjectId,
      name: String,
      slug: String
    },
    stock: String,
    stockQuantity: Number,
    ratings: {
      average: Number,
      count: Number
    },
    reviews: [
      {
        user: ObjectId,
        name: String,
        rating: Number,
        comment: String,
        createdAt: Date
      }
    ],
    bestSeller: Boolean,
    purchaseCount: Number
  }
}
```

**Error Responses:**

- `404` - Product not found
- `500` - Server error

**cURL Example:**

```bash
curl -X GET http://localhost:5000/api/products/details/biryani-chicken
```

---

### Order Endpoints

#### 1. Place Order 🔒

**POST** `/order/place-order`

Protected endpoint to place a new order.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```javascript
{
  orderItems: [
    {
      name: String (required),
      qty: Number (required),
      image: String (required),
      price: Number (required),
      product: ObjectId (required)
    }
  ],
  shippingAddress: {
    address: String (required),
    city: String (required),
    postalCode: String (required),
    phone: String (required)
  },
  paymentMethod: String (optional, default: "COD"),
  totalPrice: Number (required)
}
```

**Response (201 Created):**

```javascript
{
  success: true,
  status: 201,
  message: "Order placed successfully!",
  data: {
    _id: ObjectId,
    user: ObjectId,
    orderItems: Array,
    shippingAddress: Object,
    paymentMethod: String,
    totalPrice: Number,
    status: String,
    createdAt: Date,
    updatedAt: Date
  }
}
```

**Error Responses:**

- `400` - Cart is empty or invalid data
- `401` - Unauthorized
- `500` - Server error

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/order/place-order \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "orderItems": [
      {
        "name": "Biryani",
        "qty": 2,
        "image": "url",
        "price": 350,
        "product": "productId"
      }
    ],
    "shippingAddress": {
      "address": "123 Main Street",
      "city": "Dhaka",
      "postalCode": "1212",
      "phone": "01712345678"
    },
    "totalPrice": 700
  }'
```

---

### Review Endpoints

#### 1. Create Product Review 🔒

**POST** `/product/review/:id/reviews`

Protected endpoint to add a review to a product.

**URL Parameters:**

```
id: ObjectId (product ID)
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```javascript
{
  rating: Number (required, 1-5),
  comment: String (required)
}
```

**Response (201 Created):**

```javascript
{
  success: true,
  status: 201,
  message: "Review added successfully",
  data: {
    averageRating: Number,
    reviewCount: Number,
    reviews: [
      {
        user: ObjectId,
        name: String,
        rating: Number,
        comment: String,
        createdAt: Date
      }
    ]
  }
}
```

**Error Responses:**

- `400` - Invalid rating or already reviewed
- `401` - Unauthorized
- `404` - Product not found
- `500` - Server error

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/product/review/productId123/reviews \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Amazing biryani! Highly recommended."
  }'
```

---

### User Endpoints

#### 1. Get My Orders 🔒

**GET** `/user/my-orders`

Protected endpoint to get all orders of the logged-in user.

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

```
page: Number (optional, for pagination)
limit: Number (optional, default: 10)
```

**Response (200 OK):**

```javascript
[
  {
    _id: ObjectId,
    user: ObjectId,
    orderItems: [
      {
        name: String,
        qty: Number,
        image: String,
        price: Number,
        product: ObjectId,
      },
    ],
    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      phone: String,
    },
    paymentMethod: String,
    totalPrice: Number,
    status: String,
    createdAt: Date,
    updatedAt: Date,
  },
];
```

**Error Responses:**

- `401` - Unauthorized
- `500` - Server error

**cURL Example:**

```bash
curl -X GET http://localhost:5000/api/user/my-orders \
  -H "Authorization: Bearer <token>"
```

---

#### 2. Get All Users (Admin) 🔒

**GET** `/user/all-user`

Protected endpoint to get all users (admin only - should have role: ADMIN).

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```javascript
[
  {
    _id: ObjectId,
    name: String,
    email: String,
    image: String,
    role: String,
    createdAt: Date,
    updatedAt: Date,
  },
];
```

**Error Responses:**

- `401` - Unauthorized
- `500` - Server error

**cURL Example:**

```bash
curl -X GET http://localhost:5000/api/user/all-user \
  -H "Authorization: Bearer <token>"
```

---

### Admin Endpoints

#### 1. Create Product 🔒

**POST** `/admin/products/`

Protected admin endpoint to create a new product.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

```javascript
{
  title: String (required),
  desc: String (required),
  price: Number (required),
  discountPrice: Number (optional),
  category: ObjectId (required),
  subCategory: ObjectId (optional),
  stock: String (enum: "available", "out of stock"),
  stockQuantity: Number (optional),
  bestSeller: Boolean (optional),
  images: File[] (up to 10 files)
}
```

**Response (201 Created):**

```javascript
{
  message: "Product created successfully",
  product: {
    _id: ObjectId,
    title: String,
    slug: String,
    desc: String,
    price: Number,
    images: [String],
    // ... all product fields
  }
}
```

**Error Responses:**

- `400` - Invalid data
- `401` - Unauthorized
- `500` - Server error

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer <token>" \
  -F "title=Biryani" \
  -F "desc=Delicious biryani" \
  -F "price=350" \
  -F "category=categoryId" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

---

#### 2. Get Product by ID 🔒

**GET** `/admin/products/:id`

Protected admin endpoint to get product details.

**URL Parameters:**

```
id: ObjectId (product ID)
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```javascript
{
  _id: ObjectId,
  title: String,
  slug: String,
  desc: String,
  price: Number,
  discountPrice: Number,
  images: [String],
  category: ObjectId,
  subCategory: ObjectId,
  stock: String,
  stockQuantity: Number,
  bestSeller: Boolean,
  purchaseCount: Number,
  ratings: Object,
  reviews: Array
}
```

**Error Responses:**

- `404` - Product not found
- `401` - Unauthorized
- `500` - Server error

**cURL Example:**

```bash
curl -X GET http://localhost:5000/api/admin/products/productId123 \
  -H "Authorization: Bearer <token>"
```

---

#### 3. Update Product 🔒

**PUT** `/admin/products/:id`

Protected admin endpoint to update a product.

**URL Parameters:**

```
id: ObjectId (product ID)
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

```javascript
{
  title: String (optional),
  desc: String (optional),
  price: Number (optional),
  discountPrice: Number (optional),
  category: ObjectId (optional),
  subCategory: ObjectId (optional),
  stock: String (optional),
  stockQuantity: Number (optional),
  bestSeller: Boolean (optional),
  images: File[] (optional, up to 10 files)
}
```

**Response (200 OK):**

```javascript
{
  message: "Product updated successfully",
  updatedProduct: {
    _id: ObjectId,
    // ... updated product fields
  }
}
```

**Error Responses:**

- `400` - Invalid data
- `401` - Unauthorized
- `404` - Product not found
- `500` - Server error

**cURL Example:**

```bash
curl -X PUT http://localhost:5000/api/admin/products/productId123 \
  -H "Authorization: Bearer <token>" \
  -F "title=Updated Biryani" \
  -F "price=400"
```

---

#### 4. Delete Product 🔒

**DELETE** `/admin/products/:id`

Protected admin endpoint to delete a product.

**URL Parameters:**

```
id: ObjectId (product ID)
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```javascript
{
  message: "Product and images deleted successfully";
}
```

**Error Responses:**

- `401` - Unauthorized
- `404` - Product not found
- `500` - Server error

**cURL Example:**

```bash
curl -X DELETE http://localhost:5000/api/admin/products/productId123 \
  -H "Authorization: Bearer <token>"
```

---

#### 5. Create Category 🔒

**POST** `/admin/categories/`

Protected admin endpoint to create a new category.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

```javascript
{
  name: String (required),
  image: File (optional)
}
```

**Response (201 Created):**

```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Error Responses:**

- `400` - Category already exists or invalid data
- `401` - Unauthorized
- `500` - Server error

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/admin/categories \
  -H "Authorization: Bearer <token>" \
  -F "name=Biryani" \
  -F "image=@category.jpg"
```

---

#### 6. Update Category 🔒

**PUT** `/admin/categories/:id`

Protected admin endpoint to update a category.

**URL Parameters:**

```
id: ObjectId (category ID)
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

```javascript
{
  name: String (optional),
  image: File (optional)
}
```

**Response (200 OK):**

```javascript
{
  message: "Category updated successfully",
  category: {
    _id: ObjectId,
    name: String,
    slug: String,
    image: String
  }
}
```

**cURL Example:**

```bash
curl -X PUT http://localhost:5000/api/admin/categories/categoryId123 \
  -H "Authorization: Bearer <token>" \
  -F "name=Updated Biryani"
```

---

#### 7. Delete Category 🔒

**DELETE** `/admin/categories/:id`

Protected admin endpoint to delete a category and its subcategories.

**URL Parameters:**

```
id: ObjectId (category ID)
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```javascript
{
  message: "Category and its sub-categories deleted";
}
```

**cURL Example:**

```bash
curl -X DELETE http://localhost:5000/api/admin/categories/categoryId123 \
  -H "Authorization: Bearer <token>"
```

---

#### 8. Get Nested Categories 🔒

**GET** `/admin/categories/`

Protected admin endpoint to get all categories with nested subcategories.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```javascript
{
  success: true,
  data: [
    {
      _id: ObjectId,
      name: String,
      slug: String,
      image: String,
      subcategories: [
        {
          _id: ObjectId,
          name: String,
          slug: String,
          image: String,
          category: ObjectId
        }
      ]
    }
  ]
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:5000/api/admin/categories \
  -H "Authorization: Bearer <token>"
```

---

#### 9. Create SubCategory 🔒

**POST** `/admin/categories/subcategories`

Protected admin endpoint to create a subcategory.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

```javascript
{
  name: String (required),
  category: ObjectId (required),
  image: File (optional)
}
```

**Response (201 Created):**

```javascript
{
  _id: ObjectId,
  name: String,
  slug: String,
  image: String,
  category: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/admin/categories/subcategories \
  -H "Authorization: Bearer <token>" \
  -F "name=Chicken Biryani" \
  -F "category=categoryId123" \
  -F "image=@subcategory.jpg"
```

---

#### 10. Delete SubCategory 🔒

**DELETE** `/admin/categories/subcategories/:id`

Protected admin endpoint to delete a subcategory.

**URL Parameters:**

```
id: ObjectId (subcategory ID)
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```javascript
{
  message: "Sub-category deleted successfully";
}
```

**cURL Example:**

```bash
curl -X DELETE http://localhost:5000/api/admin/categories/subcategories/subcatId123 \
  -H "Authorization: Bearer <token>"
```

---

#### 11. Add Banner 🔒

**POST** `/admin/banners/`

Protected admin endpoint to add a banner slide.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**

```javascript
{
  title: String (required),
  subtitle: String (optional),
  image: File (required),
  isActive: Boolean (optional, default: true)
}
```

**Response (201 Created):**

```javascript
{
  success: true,
  message: "Banner slide added successfully!",
  data: {
    _id: ObjectId,
    title: String,
    subtitle: String,
    image: String,
    isActive: Boolean,
    createdAt: Date,
    updatedAt: Date
  }
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/admin/banners \
  -H "Authorization: Bearer <token>" \
  -F "title=Welcome to Halal Shop" \
  -F "subtitle=Fresh Halal Food" \
  -F "image=@banner.jpg"
```

---

#### 12. Get All Banners

**GET** `/admin/banners/`

Public endpoint to get all active banners.

**Response (200 OK):**

```javascript
{
  success: true,
  data: [
    {
      _id: ObjectId,
      title: String,
      subtitle: String,
      image: String,
      isActive: Boolean,
      createdAt: Date,
      updatedAt: Date
    }
  ]
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:5000/api/admin/banners
```

---

#### 13. Delete Banner 🔒

**DELETE** `/admin/banners/:id`

Protected admin endpoint to delete a banner.

**URL Parameters:**

```
id: ObjectId (banner ID)
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```javascript
{
  success: true,
  message: "Banner slide deleted!"
}
```

**cURL Example:**

```bash
curl -X DELETE http://localhost:5000/api/admin/banners/bannerId123 \
  -H "Authorization: Bearer <token>"
```

---

#### 14. Update Offer 🔒

**POST** `/admin/offers/`

Protected admin endpoint to update the offer text.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```javascript
{
  text: String (required),
  isActive: Boolean (optional)
}
```

**Response (200 OK):**

```javascript
{
  success: true,
  message: "Offer text updated!",
  data: {
    _id: ObjectId,
    text: String,
    isActive: Boolean,
    createdAt: Date,
    updatedAt: Date
  }
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:5000/api/admin/offers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Get 20% off on all orders above 500 BDT",
    "isActive": true
  }'
```

---

#### 15. Get Offer

**GET** `/admin/offers/`

Public endpoint to get current offer.

**Response (200 OK):**

```javascript
{
  success: true,
  data: {
    _id: ObjectId,
    text: String,
    isActive: Boolean,
    createdAt: Date,
    updatedAt: Date
  }
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:5000/api/admin/offers
```

---

#### 16. Get All Orders (Admin) 🔒

**GET** `/admin/order/`

Protected admin endpoint to get all orders.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```javascript
{
  success: true,
  count: Number,
  data: [
    {
      _id: ObjectId,
      user: ObjectId,
      orderItems: Array,
      shippingAddress: Object,
      paymentMethod: String,
      totalPrice: Number,
      status: String,
      createdAt: Date,
      updatedAt: Date
    }
  ]
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:5000/api/admin/order \
  -H "Authorization: Bearer <token>"
```

---

#### 17. Get Order Details (Admin) 🔒

**GET** `/admin/order/:id`

Protected admin endpoint to get details of a specific order.

**URL Parameters:**

```
id: ObjectId (order ID)
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```javascript
{
  success: true,
  data: {
    _id: ObjectId,
    user: {
      _id: ObjectId,
      name: String,
      email: String,
      phone: String
    },
    orderItems: Array,
    shippingAddress: Object,
    paymentMethod: String,
    totalPrice: Number,
    status: String,
    createdAt: Date,
    updatedAt: Date
  }
}
```

**Error Responses:**

- `404` - Order not found
- `401` - Unauthorized

**cURL Example:**

```bash
curl -X GET http://localhost:5000/api/admin/order/orderId123 \
  -H "Authorization: Bearer <token>"
```

---

#### 18. Update Order Status 🔒

**PATCH** `/admin/order/:id`

Protected admin endpoint to update order status.

**URL Parameters:**

```
id: ObjectId (order ID)
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```javascript
{
  status: String (required, enum: "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled")
}
```

**Response (200 OK):**

```javascript
{
  success: true,
  message: "Order status changed to <status>",
  data: {
    _id: ObjectId,
    status: String,
    // ... updated order data
  }
}
```

**Error Responses:**

- `404` - Order not found
- `401` - Unauthorized

**cURL Example:**

```bash
curl -X PATCH http://localhost:5000/api/admin/order/orderId123 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Shipped"
  }'
```

---

#### 19. Delete Order (Admin) 🔒

**DELETE** `/admin/order/:id`

Protected admin endpoint to delete an order.

**URL Parameters:**

```
id: ObjectId (order ID)
```

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```javascript
{
  success: true,
  message: "Order deleted successfully"
}
```

**Error Responses:**

- `404` - Order not found
- `401` - Unauthorized

**cURL Example:**

```bash
curl -X DELETE http://localhost:5000/api/admin/order/orderId123 \
  -H "Authorization: Bearer <token>"
```

---

#### 20. Get Dashboard Summary (Admin) 🔒

**GET** `/admin/overview/summary`

Protected admin endpoint to get dashboard statistics.

**Headers:**

```
Authorization: Bearer <token>
```

**Response (200 OK):**

```javascript
{
  success: true,
  data: {
    totalOrders: Number,
    totalRevenue: Number,
    totalUsers: Number,
    totalProducts: Number,
    ordersByStatus: {
      Pending: Number,
      Confirmed: Number,
      Shipped: Number,
      Delivered: Number,
      Cancelled: Number
    },
    monthlyRevenue: [
      {
        month: String,
        revenue: Number
      }
    ],
    topSellingProducts: [
      {
        _id: ObjectId,
        title: String,
        purchaseCount: Number,
        revenue: Number
      }
    ]
  }
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:5000/api/admin/overview/summary \
  -H "Authorization: Bearer <token>"
```

---

## Common Response Patterns

### Success Response

```javascript
{
  success: true,
  status: 200,
  message: "Operation completed successfully",
  data: { /* response data */ }
}
```

### Error Response

```javascript
{
  success: false,
  status: 400,
  message: "Error description"
}
```

### Paginated Response

```javascript
{
  success: true,
  data: [ /* array of items */ ],
  meta: {
    totalCount: Number,
    totalPages: Number,
    currentPage: Number,
    limit: Number
  }
}
```

---

## Rate Limiting & Best Practices

1. **Authentication**: Always include the JWT token in the Authorization header for protected endpoints
2. **Pagination**: Use `page` and `limit` parameters for list endpoints
3. **File Upload**: Maximum 10 image files per request for products
4. **Password Security**: Passwords are hashed using bcryptjs with 10 salt rounds
5. **CORS**: Allowed origins include localhost:5173 and mainichihalalshop.com
6. **Cookie Security**: JWT tokens are sent as httpOnly cookies for enhanced security

---

## Deployment Considerations

- Environment variables required: `PORT`, `NODE_ENV`, `DB_URI`, `JWT_SECRET`, `CLOUDINARY_KEY`, etc.
- Use HTTPS in production
- Set `secure: true` for cookies in production
- Configure CORS origins according to your domain
- Use environment-specific settings for database connections

---

## Support & Contact

For API issues or questions:

- Check the error messages returned by the API
- Verify that all required fields are provided
- Ensure JWT token is valid and not expired
- Check CORS configuration if frontend requests fail

---

**Last Updated**: July 19, 2026
**API Version**: 1.0.0
