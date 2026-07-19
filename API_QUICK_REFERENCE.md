# API Quick Reference Guide

## Endpoint Summary

| Method                 | Endpoint                                  | Description                       | Auth |
| ---------------------- | ----------------------------------------- | --------------------------------- | ---- |
| **AUTH**               |
| POST                   | `/api/auth/register`                      | Register new user                 | ❌   |
| POST                   | `/api/auth/login`                         | Login user                        | ❌   |
| GET                    | `/api/auth/me`                            | Get current user                  | 🔒   |
| PUT                    | `/api/auth/update-me`                     | Update profile                    | 🔒   |
| DELETE                 | `/api/auth/me/delete`                     | Delete account                    | 🔒   |
| POST                   | `/api/auth/logout`                        | Logout user                       | 🔒   |
| **PRODUCTS**           |
| GET                    | `/api/products/categories`                | Get categories with subcategories | ❌   |
| GET                    | `/api/products/`                          | Get all products (filterable)     | ❌   |
| GET                    | `/api/products/featured`                  | Get featured products             | ❌   |
| GET                    | `/api/products/details/:slug`             | Get product details               | ❌   |
| **ORDERS**             |
| POST                   | `/api/order/place-order`                  | Place new order                   | 🔒   |
| **REVIEWS**            |
| POST                   | `/api/product/review/:id/reviews`         | Add product review                | 🔒   |
| **USERS**              |
| GET                    | `/api/user/my-orders`                     | Get user's orders                 | 🔒   |
| GET                    | `/api/user/all-user`                      | Get all users                     | 🔒   |
| **ADMIN - PRODUCTS**   |
| POST                   | `/api/admin/products/`                    | Create product                    | 🔒   |
| GET                    | `/api/admin/products/:id`                 | Get product by ID                 | 🔒   |
| PUT                    | `/api/admin/products/:id`                 | Update product                    | 🔒   |
| DELETE                 | `/api/admin/products/:id`                 | Delete product                    | 🔒   |
| **ADMIN - CATEGORIES** |
| POST                   | `/api/admin/categories/`                  | Create category                   | 🔒   |
| GET                    | `/api/admin/categories/`                  | Get all categories                | 🔒   |
| PUT                    | `/api/admin/categories/:id`               | Update category                   | 🔒   |
| DELETE                 | `/api/admin/categories/:id`               | Delete category                   | 🔒   |
| POST                   | `/api/admin/categories/subcategories`     | Create subcategory                | 🔒   |
| DELETE                 | `/api/admin/categories/subcategories/:id` | Delete subcategory                | 🔒   |
| **ADMIN - BANNERS**    |
| POST                   | `/api/admin/banners/`                     | Add banner                        | 🔒   |
| GET                    | `/api/admin/banners/`                     | Get all banners                   | ❌   |
| DELETE                 | `/api/admin/banners/:id`                  | Delete banner                     | 🔒   |
| **ADMIN - OFFERS**     |
| POST                   | `/api/admin/offers/`                      | Update offer                      | 🔒   |
| GET                    | `/api/admin/offers/`                      | Get offer                         | ❌   |
| **ADMIN - ORDERS**     |
| GET                    | `/api/admin/order/`                       | Get all orders                    | 🔒   |
| GET                    | `/api/admin/order/:id`                    | Get order details                 | 🔒   |
| PATCH                  | `/api/admin/order/:id`                    | Update order status               | 🔒   |
| DELETE                 | `/api/admin/order/:id`                    | Delete order                      | 🔒   |
| **ADMIN - STATS**      |
| GET                    | `/api/admin/overview/summary`             | Get dashboard stats               | 🔒   |

---

## Common Query Parameters

### Product Listing (`GET /api/products/`)

- `page=1` - Page number
- `limit=12` - Items per page
- `search=biryani` - Search keyword
- `category=<id>` - Filter by category
- `minPrice=100` - Minimum price
- `maxPrice=1000` - Maximum price
- `sortBy=newest|price-low|price-high|popular` - Sort option

### Featured Products (`GET /api/products/featured`)

- `limit=8` - Number of products (default: 8)
- `page=1` - Page number

---

## Request Headers

### For Protected Endpoints (🔒)

```
Authorization: Bearer <jwt_token>
```

### For File Upload

```
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>
```

### For JSON Data

```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

---

## Common Request/Response Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "success": true,
  "user": { ... },
  "token": "eyJhbGc..."
}
```

### Login User

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "user": { ... },
  "token": "eyJhbGc..."
}
```

### Get Products

```bash
GET /api/products?page=1&limit=12&search=biryani&minPrice=200&maxPrice=500

Response: 200 OK
{
  "success": true,
  "data": [ ... products array ... ],
  "meta": {
    "totalCount": 25,
    "totalPages": 3,
    "currentPage": 1,
    "limit": 12
  }
}
```

### Place Order

```bash
POST /api/order/place-order
Authorization: Bearer <token>
Content-Type: application/json

{
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
    "address": "123 Main St",
    "city": "Dhaka",
    "postalCode": "1212",
    "phone": "01712345678"
  },
  "totalPrice": 700
}

Response: 201 Created
{
  "success": true,
  "message": "Order placed successfully!",
  "data": { ... order details ... }
}
```

### Create Product (Admin)

```bash
POST /api/admin/products/
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

Form Data:
- title: "Biryani"
- desc: "Delicious biryani"
- price: 350
- category: <categoryId>
- images: [file1.jpg, file2.jpg, ...]

Response: 201 Created
{
  "message": "Product created successfully",
  "product": { ... }
}
```

### Add Review

```bash
POST /api/product/review/<productId>/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Amazing product!"
}

Response: 201 Created
{
  "success": true,
  "message": "Review added successfully",
  "data": {
    "averageRating": 4.5,
    "reviewCount": 10,
    "reviews": [ ... ]
  }
}
```

### Update Order Status (Admin)

```bash
PATCH /api/admin/order/<orderId>
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "Shipped"
}

Response: 200 OK
{
  "success": true,
  "message": "Order status changed to Shipped",
  "data": { ... updated order ... }
}
```

---

## Error Status Codes

| Code | Meaning      | Common Cause                 |
| ---- | ------------ | ---------------------------- |
| 200  | OK           | Successful GET/PUT/PATCH     |
| 201  | Created      | Successful POST              |
| 400  | Bad Request  | Invalid data, missing fields |
| 401  | Unauthorized | Invalid/missing token        |
| 404  | Not Found    | Resource doesn't exist       |
| 500  | Server Error | Server-side error            |

---

## Common Error Messages

```javascript
// Missing fields
{ "message": "Please enter all fields." }

// User already exists
{ "message": "User already exists" }

// Invalid credentials
{ "message": "Invalid credentials" }

// Unauthorized
{ "message": "Not authorized" }

// Not found
{ "message": "Product not found" }

// Cart is empty
{ "message": "Cart is empty" }

// Already reviewed
{ "message": "You have already reviewed this product" }
```

---

## Data Models Quick Reference

### User

- `_id`, `name`, `email`, `password`, `image`, `role`, `createdAt`, `updatedAt`

### Product

- `_id`, `title`, `slug`, `desc`, `price`, `discountPrice`, `images`, `category`, `subCategory`, `stock`, `stockQuantity`, `bestSeller`, `purchaseCount`, `ratings`, `reviews`

### Category

- `_id`, `name`, `slug`, `image`, `createdAt`, `updatedAt`

### SubCategory

- `_id`, `name`, `slug`, `image`, `category`, `createdAt`, `updatedAt`

### Order

- `_id`, `user`, `orderItems`, `shippingAddress`, `paymentMethod`, `totalPrice`, `status`, `createdAt`, `updatedAt`

### Banner

- `_id`, `title`, `subtitle`, `image`, `isActive`, `createdAt`, `updatedAt`

### Offer

- `_id`, `text`, `isActive`, `createdAt`, `updatedAt`

---

## Order Status Flow

```
Pending → Confirmed → Shipped → Delivered
   ↓
Cancelled (can be set from any state)
```

---

## File Upload Limits

- Maximum 10 images per product
- Maximum 1 image per category
- Maximum 1 image per subcategory
- Maximum 1 image per banner
- Supported formats: jpg, jpeg, png, gif, webp

---

## Authentication Flow

1. **Register**: User creates account → Returns JWT token + User data
2. **Login**: User provides credentials → Returns JWT token + User data
3. **Protected Requests**: Include token in Authorization header
4. **Token Expiration**: 7 days (stored in httpOnly cookie)
5. **Logout**: Clear JWT cookie

---

## CORS Configuration

### Allowed Origins

- `http://localhost:5173` (Development)
- `https://mainichihalalshop.com` (Production)
- `https://www.mainichihalalshop.com` (Production)

### Allowed Methods

- GET, POST, PUT, DELETE, PATCH

### Credentials

- Cookies enabled (`credentials: true`)

---

## Testing Tips

### Using cURL

```bash
# Get categories
curl http://localhost:5000/api/products/categories

# Login and save token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}' \
  -s | jq -r '.token')

# Use token for protected endpoint
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. Create new collection
2. Set base URL to `http://localhost:5000/api`
3. Add Authorization tab: Type = Bearer Token
4. In token field, reference saved token variable: `{{token}}`
5. After login, manually copy token to variable or use script

### Using Insomnia

1. Create workspace
2. Set base URL to `http://localhost:5000/api`
3. Create environment with `token` variable
4. Use `Bearer {{ token }}` in Authorization
5. Update token variable from login response

---

## Performance Tips

1. **Pagination**: Always use pagination for list endpoints to reduce payload
2. **Filtering**: Use query parameters to filter on server-side
3. **Search**: Provide specific search terms for better results
4. **Sorting**: Use sortBy parameter instead of client-side sorting
5. **Caching**: Cache category/banner data as they change infrequently

---

## Troubleshooting

### 401 Unauthorized

- Check if token is expired (7 days)
- Verify token format: `Bearer <token>`
- Ensure Authorization header is present
- Login again to get new token

### 404 Not Found

- Verify the resource exists
- Check the ID format (should be valid MongoDB ObjectId)
- Ensure the endpoint path is correct

### 400 Bad Request

- Check all required fields are provided
- Verify data types (number, string, etc.)
- For file uploads, ensure multipart/form-data header
- Check for duplicate entries (email, category name, etc.)

### CORS Error

- Frontend must be from allowed origins
- Check browser console for specific CORS error
- Verify credentials flag in frontend fetch options

---

## Environment Variables

```env
PORT=5000
NODE_ENV=development
DB_URI=mongodb://localhost:27017/halal-food
JWT_SECRET=your_secret_key
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

---

**Last Updated**: July 19, 2026  
**Total Endpoints**: 30+  
**API Version**: 1.0.0
