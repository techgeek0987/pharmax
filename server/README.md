# PharmX Backend API

A robust Express.js backend API built with MongoDB, featuring comprehensive management systems for pharmaceutical operations including orders, tasks, products, invoices, and fleet management.

## 🚀 Features

### 🎯 Core Systems
- **Order Management** - Complete order lifecycle with tracking
- **Task Management** - Team collaboration and task tracking
- **Product Inventory** - Comprehensive product catalog management
- **Invoice System** - Professional invoicing with payment tracking
- **Fleet Management** - Vehicle and driver management
- **User Management** - Authentication and role-based access

### ⚡ API Features
- **RESTful Architecture** - Clean, predictable API design
- **Advanced Query Builder** - Flexible filtering, sorting, pagination
- **JWT Authentication** - Secure token-based authentication
- **Data Validation** - Comprehensive input validation
- **Error Handling** - Structured error responses
- **API Documentation** - Comprehensive endpoint documentation

### 🔧 Technical Features
- **MongoDB Integration** - Efficient database operations
- **Middleware Architecture** - Modular request processing
- **Service Layer Pattern** - Clean business logic separation
- **Base Controller** - Consistent response handling
- **Database Seeding** - Sample data for development

## 🛠 Tech Stack

### Core Technologies
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Security & Authentication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **Nodemon** - Development server with auto-restart
- **ESLint** - Code linting (optional)
- **Jest** - Testing framework (optional)

## 📁 Project Structure

```
server/
├── controllers/            # Route controllers
│   ├── authController.js   # Authentication logic
│   ├── baseController.js   # Base controller with common methods
│   ├── orderController.js  # Order management
│   ├── taskController.js   # Task management
│   ├── productController.js # Product inventory
│   ├── invoiceController.js # Invoice system
│   ├── vehicleController.js # Vehicle management
│   ├── driverController.js # Driver management
│   ├── userController.js   # User management
│   └── todoController.js   # Todo management
├── middleware/             # Express middleware
│   └── auth.js            # Authentication middleware
├── models/                # Mongoose models
│   ├── User.js            # User model
│   ├── Order.js           # Order model
│   ├── Task.js            # Task model
│   ├── Product.js         # Product model
│   ├── Invoice.js         # Invoice model
│   ├── Vehicle.js         # Vehicle model
│   ├── Driver.js          # Driver model
│   └── Todo.js            # Todo model
├── routes/                # API routes
│   ├── auth.js            # Authentication routes
│   ├── orders.js          # Order routes
│   ├── tasks.js           # Task routes
│   ├── products.js        # Product routes
│   ├── invoices.js        # Invoice routes
│   ├── vehicles.js        # Vehicle routes
│   ├── drivers.js         # Driver routes
│   ├── users.js           # User routes
│   └── todos.js           # Todo routes
├── services/              # Business logic layer
│   ├── authService.js     # Authentication services
│   ├── orderService.js    # Order business logic
│   ├── taskService.js     # Task business logic
│   ├── productService.js  # Product business logic
│   ├── invoiceService.js  # Invoice business logic
│   ├── vehicleService.js  # Vehicle business logic
│   ├── driverService.js   # Driver business logic
│   ├── userService.js     # User business logic
│   └── todoService.js     # Todo business logic
├── utils/                 # Utility functions
│   └── apiQueryBuilder.js # Advanced query builder
├── .env                   # Environment variables
├── server.js              # Main server file
├── seed.js                # Database seeding script
└── package.json           # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

### Installation
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables (see below)
# Start the server
npm run dev
```

### Environment Variables
Create a `.env` file in the server root:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/pharmx

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173

# Optional: Database seeding
SEED_DATABASE=true
```

### Available Scripts
```bash
npm start           # Start production server
npm run dev         # Start development server with nodemon
npm run seed        # Seed database with sample data
npm run test        # Run tests (if configured)
npm run lint        # Run ESLint (if configured)
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Response Format
All API responses follow a consistent format:

#### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

#### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": { ... }
}
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Order Management Endpoints

#### Get Orders
```http
GET /api/orders?page=1&limit=10&status=open&sort=-createdAt
Authorization: Bearer <token>
```

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "#ORD001",
  "location": "Downtown Pharmacy",
  "packages": 25,
  "type": "EXPRESS",
  "status": "to-be-fulfilled",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Assign Vehicle and Driver
```http
POST /api/orders/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "vehicleId": "VH-001",
  "driverId": "DR-001"
}
```

### Task Management Endpoints

#### Get Tasks
```http
GET /api/tasks?status=todo&priority=high&assignedTo=userId
Authorization: Bearer <token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete inventory check",
  "description": "Check all products in warehouse A",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "assignedTo": "userId"
}
```

### Product Management Endpoints

#### Get Products
```http
GET /api/products?category=prescription&status=active&lowStock=true
Authorization: Bearer <token>
```

#### Create Product
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Aspirin 100mg",
  "sku": "ASP-100",
  "category": "over-the-counter",
  "price": {
    "cost": 5.00,
    "selling": 8.99
  },
  "inventory": {
    "quantity": 100,
    "reorderPoint": 20
  }
}
```

### Invoice Management Endpoints

#### Get Invoices
```http
GET /api/invoices?status=sent&paymentStatus=pending
Authorization: Bearer <token>
```

#### Create Invoice
```http
POST /api/invoices
Authorization: Bearer <token>
Content-Type: application/json

{
  "customer": {
    "name": "ABC Pharmacy",
    "email": "orders@abcpharmacy.com"
  },
  "items": [
    {
      "productDetails": {
        "name": "Aspirin 100mg",
        "sku": "ASP-100"
      },
      "quantity": 50,
      "unitPrice": 8.99
    }
  ],
  "dueDate": "2024-12-31"
}
```

## 🏗 Architecture Patterns

### Controller Pattern
Controllers handle HTTP requests and responses:

```javascript
// controllers/baseController.js
class BaseController {
  handleAsync(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  sendSuccess(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  sendError(res, message = 'Internal Server Error', statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message
    });
  }
}
```

### Service Layer Pattern
Services contain business logic:

```javascript
// services/orderService.js
const orderService = {
  async getAllOrders(queryString) {
    const apiQuery = new ApiQueryBuilder(Order.find(), queryString)
      .filter()
      .search(['id', 'location', 'type'])
      .sort()
      .paginate();

    const orders = await apiQuery.execute();
    const paginationInfo = await apiQuery.getPaginationInfo(Order);

    return { orders, pagination: paginationInfo };
  },

  async createOrder(orderData) {
    const order = new Order(orderData);
    return await order.save();
  }
};
```

### Advanced Query Builder
Flexible API querying:

```javascript
// utils/apiQueryBuilder.js
class ApiQueryBuilder {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Implementation for filtering
    return this;
  }

  search(searchFields) {
    // Implementation for searching
    return this;
  }

  sort() {
    // Implementation for sorting
    return this;
  }

  paginate() {
    // Implementation for pagination
    return this;
  }
}
```

## 🗄 Database Models

### Order Model
```javascript
// models/Order.js
const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  packages: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['EXPRESS', 'REFRIGERATED', 'HEAVY', 'STANDARD'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['to-be-fulfilled', 'open', 'ready', 'assigned', 'in-transit', 'delivered'],
    default: 'to-be-fulfilled' 
  },
  customer: {
    name: String,
    email: String,
    phone: String
  },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### Product Model
```javascript
// models/Product.js
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: {
    cost: { type: Number, required: true },
    selling: { type: Number, required: true }
  },
  inventory: {
    quantity: { type: Number, default: 0 },
    reorderPoint: { type: Number, default: 20 }
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active' 
  }
});
```

## 🔐 Security Implementation

### JWT Authentication
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};
```

### Password Hashing
```javascript
// services/authService.js
const bcrypt = require('bcryptjs');

const authService = {
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },

  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
};
```

## 🧪 Testing

### Unit Testing Example
```javascript
// tests/services/orderService.test.js
const orderService = require('../services/orderService');
const Order = require('../models/Order');

describe('Order Service', () => {
  describe('createOrder', () => {
    it('should create a new order', async () => {
      const orderData = {
        id: '#TEST001',
        location: 'Test Location',
        packages: 10,
        type: 'EXPRESS'
      };

      const result = await orderService.createOrder(orderData);
      
      expect(result).toBeDefined();
      expect(result.id).toBe('#TEST001');
    });
  });
});
```

### Integration Testing
```javascript
// tests/routes/orders.test.js
const request = require('supertest');
const app = require('../server');

describe('Orders API', () => {
  it('should get all orders', async () => {
    const response = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
```

## 🚀 Deployment

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pharmx
JWT_SECRET=your-production-jwt-secret
PORT=5000
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/pharmx
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - mongo

  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## 📊 Database Seeding

### Seed Script
```javascript
// seed.js
const mongoose = require('mongoose');
const { seedDashboardData } = require('./seedData');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await seedDashboardData();
    console.log('Database seeded successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
```

### Running Seeds
```bash
# Seed the database
npm run seed

# Or with specific environment
NODE_ENV=development npm run seed
```

## 🔧 Development Tools

### Nodemon Configuration
```json
// nodemon.json
{
  "watch": ["server.js", "controllers/", "models/", "routes/", "services/"],
  "ext": "js,json",
  "ignore": ["node_modules/", "tests/"],
  "exec": "node server.js"
}
```

### ESLint Configuration
```json
// .eslintrc.json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": ["eslint:recommended"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
```

## 📈 Performance Optimization

### Database Indexing
```javascript
// Add indexes for better query performance
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'customer.email': 1 });
productSchema.index({ sku: 1 });
productSchema.index({ category: 1, status: 1 });
```

### Caching Strategy
```javascript
// Simple in-memory caching
const cache = new Map();

const getCachedData = (key, fetchFunction, ttl = 300000) => {
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (Date.now() - timestamp < ttl) {
      return data;
    }
  }
  
  const data = fetchFunction();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Run linting and tests
6. Submit a pull request

### Code Standards
- Follow JavaScript/Node.js best practices
- Use consistent naming conventions
- Write comprehensive JSDoc comments
- Implement proper error handling
- Add unit tests for new features

## 📚 Additional Resources

### Documentation
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [JWT.io](https://jwt.io/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [Nodemon](https://nodemon.io/) - Development server

---

**Built with ❤️ for pharmaceutical operations management**