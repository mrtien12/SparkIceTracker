# VietinBank Data Management Platform - Authentication System

## Overview

This document provides a comprehensive guide for the authentication system implemented in the VietinBank Data Management Platform. The system ensures secure user access and data isolation for Spark jobs and Iceberg tables management.

## Authentication Architecture

### Backend Components

#### 1. Authentication Middleware (`server/auth.ts`)
- **JWT-like Session Management**: Uses secure session tokens stored in memory
- **Password Storage**: Uses plain text 12-character randomly generated passwords
- **Session Management**: In-memory session store with token-based authentication
- **Password Generation**: Automatically generates 12-character plain text passwords

#### 2. User Management (`server/admin-utils.ts`)
- **Admin User Creation**: Creates users with randomly generated passwords
- **Password Policy**: 12-character passwords with mixed case, numbers, and symbols
- **Username Validation**: Minimum 3 characters, maximum 50 characters

#### 3. Database Schema Updates
- Added `userId` foreign key to both `spark_jobs` and `iceberg_tables`  
- Maintains data isolation between users
- Each user can only access their own data

### Frontend Components

#### 1. Authentication Context (`client/src/hooks/use-auth.tsx`)
- **Global State Management**: Manages user authentication state across the app
- **Token Storage**: Stores JWT tokens in localStorage
- **Automatic Token Validation**: Verifies token validity on app initialization
- **Logout Handling**: Clears sessions and cached data

#### 2. Login Page (`client/src/pages/login.tsx`)
- **Professional UI**: VietinBank branded login interface
- **Form Validation**: Real-time validation using Zod schemas
- **Error Handling**: Clear error messages for failed login attempts
- **Loading States**: Visual feedback during authentication

#### 3. Protected Routes
- **Conditional Rendering**: Shows login page for unauthenticated users
- **Loading States**: Displays loading screen during authentication check
- **Automatic Redirects**: Seamless navigation after successful login

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/login` - User login with username/password
- `POST /api/auth/logout` - User logout (clears session)
- `GET /api/auth/me` - Get current user information

### Admin Endpoints
- `POST /api/admin/create-user` - Create new user with random password

### Protected Data Endpoints
All data endpoints now require authentication:
- `GET /api/spark-jobs` - Get user's Spark jobs
- `POST /api/spark-jobs` - Create new Spark job for user
- `PUT /api/spark-jobs/:id` - Update user's Spark job
- `DELETE /api/spark-jobs/:id` - Delete user's Spark job
- `GET /api/iceberg-tables` - Get user's Iceberg tables
- `POST /api/iceberg-tables` - Create new Iceberg table for user
- `PUT /api/iceberg-tables/:id` - Update user's Iceberg table
- `DELETE /api/iceberg-tables/:id` - Delete user's Iceberg table

## User Management Guide

### Creating New Users (Admin Only)

#### Method 1: Using the API Endpoint
```bash
curl -X POST http://localhost:5000/api/admin/create-user \
  -H "Content-Type: application/json" \
  -d '{"username":"new.user"}'
```

#### Method 2: Using the Node.js Utility
```javascript
import { createUserWithRandomPassword } from './server/admin-utils.js';

async function addUser() {
  const result = await createUserWithRandomPassword({ 
    username: "john.doe" 
  });
  
  console.log("Username:", result.user.username);
  console.log("Generated Password:", result.password);
  // Share password securely with the user
}
```

#### Method 3: Using SQL (Direct Database)
```sql
-- First, hash the password using bcrypt (salt rounds: 12)
INSERT INTO users (username, password) 
VALUES ('username', '$2a$12$hashedPasswordHere');
```

### User Login Process

1. **User Access**: Navigate to the application URL
2. **Login Screen**: Enter username and password
3. **Authentication**: System validates credentials
4. **Session Creation**: Server creates secure session token
5. **Dashboard Access**: User gains access to their data

### Data Isolation

- **User-Specific Data**: Each user can only see their own Spark jobs and Iceberg tables
- **Foreign Key Relationships**: All data is linked to user IDs
- **API Protection**: All data endpoints require valid authentication
- **Session Management**: Secure token-based session handling

## Security Features

### Password Security
- **Plain Text Storage**: 12-character randomly generated passwords stored as plain text
- **Random Generation**: 12-character passwords with mixed character types (letters, numbers, symbols)
- **Simple Authentication**: Direct password comparison for login validation

### Session Security
- **Token-Based Authentication**: Secure session tokens
- **Session Expiration**: Automatic session cleanup
- **HTTPS Ready**: Works with SSL/TLS encryption

### API Security
- **Authentication Required**: All data endpoints are protected
- **Authorization Checks**: Users can only access their own data
- **Input Validation**: Zod schema validation on all inputs

## Environment Setup

### Required Environment Variables
```bash
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=development # or production
```

### Database Migration
```bash
npm run db:push
```

## Usage Examples

### Creating a Test User
```bash
# Create user via API
curl -X POST http://localhost:5000/api/admin/create-user \
  -H "Content-Type: application/json" \
  -d '{"username":"test.user"}'

# Response:
# {
#   "user": { "id": 1, "username": "test.user" },
#   "password": "aB3$xY9#mN2k"
# }
```

### User Login
```bash
# Login request
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test.user","password":"aB3$xY9#mN2k"}'

# Response:
# {
#   "token": "abc123...",
#   "user": { "id": 1, "username": "test.user" }
# }
```

### Accessing Protected Data
```bash
# Get user's Spark jobs
curl -H "Authorization: Bearer abc123..." \
  http://localhost:5000/api/spark-jobs
```

## Troubleshooting

### Common Issues

1. **Cannot Login**: Check username/password combination
2. **Session Expired**: Re-login to get new token
3. **No Data Visible**: Ensure user has created data under their account
4. **API Errors**: Check authentication token in request headers

### Admin Tasks

1. **Reset User Password**: Delete user and recreate with new password
2. **User Management**: Use the admin utilities for user creation
3. **Database Access**: Query users table for user management

## Security Best Practices

1. **Change Default Passwords**: Users should change generated passwords
2. **Secure Password Sharing**: Share passwords through secure channels
3. **Regular Token Rotation**: Implement token refresh for production
4. **HTTPS**: Always use HTTPS in production environments
5. **Database Security**: Secure database access with proper credentials

## Development vs Production

### Development
- In-memory session storage
- Console logging for debugging
- Direct API access for user creation

### Production Recommendations
- Redis/Database session storage
- Rate limiting on authentication endpoints
- Admin panel for user management
- Audit logging for user actions
- Token refresh mechanism
- Password change functionality

This authentication system provides a secure foundation for the VietinBank Data Management Platform while maintaining simplicity for administrative tasks.