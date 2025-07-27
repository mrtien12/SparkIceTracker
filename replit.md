# VietinBank Data Management Platform

## Overview

This is a full-stack web application for managing Spark jobs and Iceberg tables at VietinBank. It's built as a data management platform with CRUD operations, real-time monitoring capabilities, a professional enterprise interface, and comprehensive user authentication system with data isolation.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 2025)

✅ **Authentication System Implementation**: 
- Added complete user authentication with login/logout functionality
- Implemented plain text password storage with 12-character random generation
- Created session-based authentication with Bearer tokens
- Added user-specific data isolation for Spark jobs and Iceberg tables
- Built professional login interface with VietinBank branding
- Created admin utilities for user management with random password generation
- Updated all API endpoints to require authentication
- Added comprehensive documentation in AUTHENTICATION_SYSTEM_README.md

✅ **Database Schema Updates**:
- Added users table with secure password storage
- Updated spark_jobs and iceberg_tables with userId foreign keys
- Implemented proper data relationships and constraints
- Successfully migrated database schema

✅ **Security Enhancements**:
- All data endpoints now require valid authentication
- Users can only access their own data
- Secure token-based session management
- Protected admin endpoints for user creation

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend concerns:

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom VietinBank brand colors
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Database ORM**: Drizzle ORM
- **Validation**: Zod schemas shared between frontend and backend

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle migrations
- **Connection**: Connection pooling with @neondatabase/serverless
- **Authentication**: Session-based authentication with plain text passwords
- **Data Isolation**: User-specific data access with foreign key relationships

## Key Components

### Database Schema
The application manages three main entities:

1. **Users** (`users` table):
   - Username (unique identifier, 3-50 characters)
   - Password (plain text, 12-character randomly generated)
   - Used for authentication and data isolation

2. **Spark Jobs** (`spark_jobs` table):
   - User ID (foreign key to users table)
   - User email (must end with @vietinbank.vn)
   - Application name (unique identifier)
   - Chat ID (8-digit validation)
   - Resource allocation (RAM, cores, executors)
   - Active status

3. **Iceberg Tables** (`iceberg_tables` table):
   - User ID (foreign key to users table)
   - Table name (unique identifier)
   - Job type classification
   - Storage location
   - Active status

### API Endpoints

#### Authentication Endpoints
- `POST /api/auth/login` - User login with username/password
- `POST /api/auth/logout` - User logout (clears session)
- `GET /api/auth/me` - Get current user information

#### Admin Endpoints
- `POST /api/admin/create-user` - Create new user with randomly generated password

#### Protected Data Endpoints (Require Authentication)
- `GET/POST /api/spark-jobs` - List and create user's Spark jobs
- `PUT/DELETE /api/spark-jobs/:id` - Update and delete user's Spark jobs
- `GET/POST /api/iceberg-tables` - List and create user's Iceberg tables
- `PUT/DELETE /api/iceberg-tables/:id` - Update and delete user's Iceberg tables

### Frontend Components
- **Login Page**: Professional authentication interface with form validation
- **Dashboard**: Main application interface with sidebar navigation (protected)
- **Data Tables**: Interactive tables for both Spark jobs and Iceberg tables (user-specific)
- **Dialog Forms**: Modal forms for creating and editing records
- **Sidebar Navigation**: Branded navigation with VietinBank styling and logout functionality
- **Authentication Context**: Global state management for user sessions

## Data Flow

1. **Authentication**: User logs in through login page, receives session token
2. **Client Requests**: Frontend makes authenticated API calls using TanStack Query with Bearer tokens
3. **Authorization**: Express middleware validates session tokens and user permissions
4. **API Processing**: Express routes handle requests with Zod validation and user-specific filtering
5. **Database Operations**: Drizzle ORM executes SQL operations with user ID constraints
6. **Response Handling**: JSON responses sent back to client with user-specific data
7. **UI Updates**: TanStack Query automatically updates UI state

The application uses optimistic updates, proper error handling, and complete data isolation throughout the data flow.

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **react-hook-form**: Form handling
- **zod**: Runtime type validation

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Production bundling

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Requirements
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)

### Hosting Architecture
- **Frontend**: Static files served from `dist/public`
- **Backend**: Express server serves API and static files
- **Database**: PostgreSQL (Neon serverless recommended)

The application is designed for deployment on platforms like Replit, with proper environment variable configuration and database provisioning.

### Key Architectural Decisions

1. **Monorepo Structure**: Client, server, and shared code in single repository for easier development
2. **Shared Schema**: Zod schemas in `/shared` directory ensure type safety between frontend and backend
3. **Component-Based UI**: Modular React components with consistent design patterns
4. **Type Safety**: End-to-end TypeScript for better developer experience
5. **Professional Branding**: Custom VietinBank color scheme and corporate styling