# Prisma Express PostgreSQL API

A RESTful API built with Express.js, Prisma ORM, and PostgreSQL for managing users, posts, and comments.

## 🚀 Live Demo

**Base URL:** [Live Link](https://prisma-express-postgresql.onrender.com/)

> ⚠️ **Important Notice:** This API is deployed on Render.com's free tier. The first request may take 30-60 seconds to respond due to cold start (server spin-up time). Subsequent requests will be faster.

> API is deployed on Render

## 📚 API Documentation

### Authentication

This API uses JWT (JSON Web Tokens) for authentication. The JWT token is stored as an HTTP-only cookie named `accessToken` and is automatically included in requests to protected routes.

---

## 👤 User Management

### 1. Register User
- **Endpoint:** `POST /api/user/adduser`
- **Description:** Register a new user account
- **Authentication:** Not required
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "User registered successfully"
}
```
- **Error Responses:**
  - `400` - All fields are required
  - `400` - Email already taken. Please use another email.

### 2. Login User
- **Endpoint:** `POST /api/user/login`
- **Description:** Authenticate user and receive JWT token as HTTP-only cookie
- **Authentication:** Not required
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```
- **Error Responses:**
  - `400` - Email and password are required
  - `401` - Invalid email or password

### 3. Logout User
- **Endpoint:** `POST /api/user/logout`
- **Description:** Logout user and clear authentication cookie
- **Authentication:** Required
- **Request Body:** None
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "User logged out successfully"
}
```

### 4. Get All Users
- **Endpoint:** `GET /api/user/`
- **Description:** Retrieve all registered users
- **Authentication:** Not required
- **Success Response (200):**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "password": "$2a$10$...",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 5. Get User by ID
- **Endpoint:** `GET /api/user/:id`
- **Description:** Retrieve specific user by ID
- **Authentication:** Not required
- **URL Parameters:** `id` (integer) - User ID
- **Success Response (200):**
```json
{
  "status": 200,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "password": "$2a$10$...",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. Update User
- **Endpoint:** `PUT /api/user/update`
- **Description:** Update user profile (name and/or password)
- **Authentication:** Required
- **Request Body (at least one field required):**
```json
{
  "name": "Updated Name",
  "password": "newpassword123"
}
```
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": 1,
    "name": "Updated Name",
    "email": "john@example.com",
    "password": "$2a$10$...",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "User updated successfully"
}
```
- **Error Responses:**
  - `400` - No fields provided to update
  - `401` - Unauthorized request

### 7. Delete User
- **Endpoint:** `DELETE /api/user/delete`
- **Description:** Delete user account
- **Authentication:** Required
- **Request Body:** None
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "User deleted successfully"
}
```

---

## 📝 Post Management

### 1. Create Post
- **Endpoint:** `POST /api/post/addpost`
- **Description:** Create a new post
- **Authentication:** Required
- **Request Body:**
```json
{
  "title": "My First Post",
  "description": "This is the content of my post."
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "My First Post",
    "description": "This is the content of my post.",
    "comment_count": 0,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Post created successfully"
}
```
- **Error Responses:**
  - `400` - Title and Description are required
  - `401` - Unauthorized request

### 2. Get All Posts (with Pagination)
- **Endpoint:** `GET /api/post/`
- **Description:** Retrieve paginated posts with comments and user information
- **Authentication:** Not required
- **Query Parameters:**
  - `page` (optional, default: 1) - Page number
  - `limit` (optional, default: 5, max: 100) - Posts per page
- **Example:** `GET /api/post/?page=1&limit=10`
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "posts": [
      {
        "id": 1,
        "user_id": 1,
        "title": "My First Post",
        "description": "This is the content of my post.",
        "comment_count": 2,
        "created_at": "2024-01-01T00:00:00.000Z",
        "user": {
          "name": "John Doe"
        },
        "comment": [
          {
            "id": "uuid-string",
            "post_id": 1,
            "user_id": 2,
            "comment": "Great post!",
            "created_at": "2024-01-01T01:00:00.000Z",
            "user": {
              "name": "Jane Smith"
            }
          }
        ]
      }
    ],
    "meta": {
      "totalPages": 5,
      "currentPage": 1,
      "limit": 5
    }
  },
  "message": "Posts fetched successfully"
}
```

### 3. Get Post by ID
- **Endpoint:** `GET /api/post/:id`
- **Description:** Retrieve specific post by ID with user information
- **Authentication:** Not required
- **URL Parameters:** `id` (integer) - Post ID
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "My First Post",
    "description": "This is the content of my post.",
    "comment_count": 0,
    "created_at": "2024-01-01T00:00:00.000Z",
    "user": {
      "name": "John Doe"
    }
  },
  "message": "Post retrieved successfully"
}
```
- **Error Responses:**
  - `404` - No post found

### 4. Search Posts
- **Endpoint:** `GET /api/post/search`
- **Description:** Search posts by description (case-insensitive)
- **Authentication:** Not required
- **Query Parameters:**
  - `q` (required) - Search query string
- **Example:** `GET /api/post/search?q=javascript`
- **Success Response (200):**
```json
{
  "status": 200,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "JavaScript Tips",
      "description": "Learn these JavaScript tricks",
      "comment_count": 0,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 5. Delete Post
- **Endpoint:** `DELETE /api/post/:id`
- **Description:** Delete a post (only by post owner)
- **Authentication:** Required
- **URL Parameters:** `id` (integer) - Post ID
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {},
  "message": "Post deleted successfully"
}
```
- **Error Responses:**
  - `401` - Unauthorized request
  - `403` - Forbidden: You are not the owner of this post
  - `404` - Post not found

---

## 💬 Comment Management

### 1. Create Comment
- **Endpoint:** `POST /api/comment/addcomment`
- **Description:** Add a comment to a post
- **Authentication:** Required
- **Request Body:**
```json
{
  "post_id": 1,
  "comment": "This is a great post!"
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": "uuid-string",
    "user_id": 1,
    "post_id": 1,
    "comment": "This is a great post!",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "Comment created successfully."
}
```
- **Error Responses:**
  - `400` - post_id and comment are required
  - `401` - Unauthorized request
  - `404` - Post not found

### 2. Get Comments by Post ID
- **Endpoint:** `GET /api/comment/:postId`
- **Description:** Retrieve all comments for a specific post
- **Authentication:** Not required
- **URL Parameters:** `postId` (integer) - Post ID
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "uuid-string",
      "user_id": 1,
      "post_id": 1,
      "comment": "This is a great post!",
      "created_at": "2024-01-01T00:00:00.000Z",
      "user": {
        "name": "John Doe"
      }
    }
  ],
  "message": "Comments fetched successfully"
}
```

### 3. Get Comment by ID
- **Endpoint:** `GET /api/comment/:id`
- **Description:** Retrieve specific comment by ID
- **Authentication:** Not required
- **URL Parameters:** `id` (string) - Comment UUID
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "uuid-string",
    "user_id": 1,
    "post_id": 1,
    "comment": "This is a great post!",
    "created_at": "2024-01-01T00:00:00.000Z",
    "user": {
      "name": "John Doe"
    }
  },
  "message": "Comment retrieved successfully"
}
```
- **Error Responses:**
  - `404` - Comment not found

### 4. Delete Comment
- **Endpoint:** `DELETE /api/comment/:id`
- **Description:** Delete a comment (only by comment owner)
- **Authentication:** Required
- **URL Parameters:** `id` (string) - Comment UUID
- **Request Body:**
```json
{
  "post_id": 1
}
```
- **Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "data": null,
  "message": "Comment deleted successfully"
}
```
- **Error Responses:**
  - `401` - Unauthorized request
  - `403` - Forbidden: Not the comment owner
  - `404` - Post not found

---

## 🔐 Authentication Details

- **JWT Token:** Stored as HTTP-only cookie named `accessToken`
- **Token Expiry:** 24 hours (1 day)
- **Cookie Settings:** 
  - `httpOnly: true` (prevents XSS attacks)
  - `secure: true` (HTTPS only in production)
  - `maxAge: 24 * 60 * 60 * 1000` (24 hours)

## 📋 Data Models

### User
```javascript
{
  id: Integer (Auto-increment)
  name: String (Optional)
  email: String (Unique, Required)
  password: String (Hashed, Required)
  created_at: DateTime (Auto-generated)
}
```

### Post
```javascript
{
  id: Integer (Auto-increment)
  user_id: Integer (Foreign Key to User)
  title: String (Required)
  description: String (Required)
  comment_count: Integer (Default: 0, Auto-updated)
  created_at: DateTime (Auto-generated)
}
```

### Comment
```javascript
{
  id: String (UUID, Auto-generated)
  post_id: Integer (Foreign Key to Post)
  user_id: Integer (Foreign Key to User)
  comment: String (Required)
  created_at: DateTime (Auto-generated)
}
```

## 🛠️ Error Response Format

All endpoints return standardized error responses using the `ApiResponse` utility:

```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `400` - Bad Request (validation errors, missing fields)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## 📖 Setup Guide

### To set up express-prisma-postgresql backend follow my blog on dev community

[Setup Guide - Express + Prisma + PostgreSQL Tutorial](https://dev.to/ajor-saha/setting-up-a-backend-with-prisma-express-and-postgresql-482e)