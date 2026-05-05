# LogiTrack Backend

A secure, scalable Express.js and MongoDB backend for shipment tracking and logistics management. Built with MVC architecture, comprehensive input validation, bcrypt password hashing, and centralized error handling.

## Overview

LogiTrack is a logistics platform that enables small business owners to track shipments in real-time. This backend provides REST APIs for user authentication, shipment management, and status tracking with role-based access control.

### What This App Does

- **User Management:** Register, login, and manage user profiles with JWT authentication
- **Shipment Tracking:** Create shipments, track status in real-time, and assign carriers
- **Authorization:** Role-based access control (user/admin) with granular permissions
- **Security:** Bcrypt password hashing, NoSQL injection prevention, input validation

---

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js | 18.0+ |
| **Framework** | Express.js | 4.17.1 |
| **Database** | MongoDB | 4.0+ |
| **Authentication** | JWT (jsonwebtoken) | 8.5.1 |
| **Password Hashing** | Bcrypt | 5.1.0 |
| **Input Validation** | Joi | 17.9.2 |
| **CORS** | cors | 2.8.5 |
| **Dev Tools** | Nodemon | 2.0.4 |

---

## Quick Start

### Prerequisites

- Node.js 18.0 or higher
- MongoDB 4.0 or higher (local or Atlas)
- npm 9.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kalviumcommunity/dead-code-society-rescue.git
   cd dead-code-society-rescue
   git checkout -b codebase-rescue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/logitrack
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   ```

4. **Start MongoDB** (if local)
   ```bash
   # On Windows
   mongod
   
   # On macOS
   brew services start mongodb-community
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Verify the server is running**
   ```bash
   curl http://localhost:3000
   # Expected: {"message":"LogiTrack Backend running"}
   ```

---

## Environment Variables

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `PORT` | `3000` | No | Server port. Default: 3000 |
| `DATABASE_URL` | `mongodb://localhost:27017/logitrack` | **Yes** | MongoDB connection string. Use Atlas for cloud. |
| `JWT_SECRET` | `your_super_secret_key_123` | **Yes** | Secret key for JWT token signing. Use strong random string. Min 32 chars recommended. |

**Security Note:** Never commit `.env` to version control. Each environment should have its own secrets.

---

## Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── auth.controller.js
│   ├── shipment.controller.js
│   └── user.controller.js
├── services/             # Business logic
│   ├── auth.service.js
│   ├── shipment.service.js
│   └── user.service.js
├── middlewares/          # Express middleware
│   ├── auth.middleware.js
│   ├── validation.middleware.js
│   └── error.middleware.js
├── routes/               # API routes
│   ├── index.js          # Main route aggregator
│   ├── auth.routes.js
│   ├── shipment.routes.js
│   └── user.routes.js
├── validators/           # Joi validation schemas
│   ├── auth.validator.js
│   └── shipment.validator.js
├── utils/                # Utility functions
│   ├── errors.util.js    # Custom error classes
│   └── response.util.js  # Response formatting
└── app.js                # Express app setup

models/                    # Mongoose schemas
├── User.js
└── Shipment.js
```

### Architecture Layers

- **Routes:** Define HTTP endpoints and wire validators
- **Controllers:** Parse requests, call services, return responses
- **Services:** Implement business logic, handle database queries
- **Models:** Mongoose schemas for MongoDB documents
- **Middlewares:** Authentication, validation, error handling
- **Utils:** Reusable helpers and custom error types
- **Validators:** Joi schemas for input validation

---

## API Reference

### Base URL
```
http://localhost:3000/api
```

### Health Check

**GET** `/health`

```bash
curl http://localhost:3000/api/health
```

Response (200):
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2026-05-05T10:30:00.000Z"
}
```

---

### Authentication

#### Register User

**POST** `/auth/register`

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

Validation rules:
- `name`: min 2, max 100 characters
- `email`: valid email format
- `password`: min 8 characters

Response (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

#### Login User

**POST** `/auth/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

Response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Token expires in 12 hours.** Include token in `Authorization` header for protected routes.

---

#### Get Profile

**GET** `/users/profile`  
**Authorization Required:** Yes

Headers:
```
Authorization: YOUR_JWT_TOKEN_HERE
```

Response (200):
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-05-05T10:15:00.000Z"
  }
}
```

---

### Shipments

#### Create Shipment

**POST** `/shipments`  
**Authorization Required:** Yes

Request body:
```json
{
  "origin": "New York, NY",
  "destination": "Los Angeles, CA",
  "weight": 25.5,
  "carrier": "FedEx"
}
```

Validation rules:
- `origin`, `destination`, `carrier`: required, non-empty string
- `weight`: required, positive number

Response (201):
```json
{
  "success": true,
  "message": "Shipment created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "trackingId": "SHIP-1714896600000-742",
    "origin": "New York, NY",
    "destination": "Los Angeles, CA",
    "weight": 25.5,
    "carrier": "FedEx",
    "status": "pending",
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2026-05-05T10:30:00.000Z",
    "updatedAt": "2026-05-05T10:30:00.000Z"
  }
}
```

#### Get All Shipments

**GET** `/shipments`  
**Authorization Required:** Yes

#### Get Shipment by ID

**GET** `/shipments/:id`  
**Authorization Required:** Yes

#### Update Shipment Status

**PATCH** `/shipments/:id/status`  
**Authorization Required:** Yes

Request body:
```json
{
  "status": "in-progress"
}
```

Valid statuses: `pending`, `in-progress`, `delivered`, `cancelled`

#### Delete Shipment

**DELETE** `/shipments/:id`  
**Authorization Required:** Yes

---

## Testing with curl

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

---

## Security Features

✅ Bcrypt password hashing (12 rounds)  
✅ JWT authentication with 12-hour expiration  
✅ NoSQL injection prevention via Joi validation  
✅ Role-based access control (user/admin)  
✅ Centralized error handling  
✅ Timing-safe password comparison  

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

ISC License

---
### 🛠 Author
*Created with ❤️ by Senior Junior Developer*

##### 
**Note**: Please check with the lead developer if you have issues with the database connection.
