# SaaS Task Manager

A scalable SaaS task management application built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication and authorization using JWT
- Role-based access control (RBAC)
- Task management (create, read, update, delete)
- User profile management
- Secure API with middleware for error handling and authentication

## Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Zod
- **Password Hashing**: bcrypt
- **CORS**: Enabled for cross-origin requests
- **Logging**: Morgan

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd saas-task-manager
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/saas-task-manager
   JWT_SECRET=your-secret-key
   ```

4. Run the application in development mode:
   ```
   npm run dev
   ```

5. Build the application:
   ```
   npm run build
   ```

6. Start the production server:
   ```
   npm start
   ```

## API Endpoints

- **Authentication**:
  - POST /api/login - User login
  - POST /api/user - User registration

- **Tasks**:
  - GET /api/task - Get all tasks
  - POST /api/task - Create a new task
  - PUT /api/task/:id - Update a task
  - DELETE /api/task/:id - Delete a task

- **Profile**:
  - GET /api/profile - Get user profile
  - PUT /api/profile - Update user profile

## Project Structure

```
src/
├── config/          # Database and environment configuration
├── login/           # Login related files (BO, controller, DAL, DAO, route, schema)
├── middleware/      # Authentication, error handling, not found middleware
├── models/          # Mongoose models for Task and User
├── profile/         # Profile controller and route
├── task/            # Task related files (BO, controller, DAL, DAO, route)
├── types/           # TypeScript type definitions
├── user/            # User related files (BO, controller, DAL, DAO, route)
└── utils/           # Utility functions (error handling, async wrapper, RBAC)
```

