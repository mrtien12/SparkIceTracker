# VietinBank Data Management Platform

## Overview

This is a full-stack web application for managing Spark jobs and Iceberg tables at VietinBank. It's built as a data management platform with CRUD operations, real-time monitoring capabilities, and a professional enterprise interface.

## User Preferences

Preferred communication style: Simple, everyday language.

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

## Key Components

### Database Schema
The application manages two main entities:

1. **Spark Jobs** (`spark_jobs` table):
   - User email (must end with @vietinbank.vn)
   - Application name (unique identifier)
   - Chat ID (8-digit validation)
   - Resource allocation (RAM, cores, executors)
   - Active status

2. **Iceberg Tables** (`iceberg_tables` table):
   - Table name (unique identifier)
   - Job type classification
   - Storage location
   - Active status

### API Endpoints
- `GET/POST /api/spark-jobs` - List and create Spark jobs
- `PUT/DELETE /api/spark-jobs/:id` - Update and delete Spark jobs
- `GET/POST /api/iceberg-tables` - List and create Iceberg tables
- `PUT/DELETE /api/iceberg-tables/:id` - Update and delete Iceberg tables

### Frontend Components
- **Dashboard**: Main application interface with sidebar navigation
- **Data Tables**: Interactive tables for both Spark jobs and Iceberg tables
- **Dialog Forms**: Modal forms for creating and editing records
- **Sidebar Navigation**: Branded navigation with VietinBank styling

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack Query
2. **API Processing**: Express routes handle requests with Zod validation
3. **Database Operations**: Drizzle ORM executes SQL operations
4. **Response Handling**: JSON responses sent back to client
5. **UI Updates**: TanStack Query automatically updates UI state

The application uses optimistic updates and proper error handling throughout the data flow.

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