# VietinBank Data Management Platform

A full-stack web application for managing Spark jobs and Iceberg tables at VietinBank with CRUD operations, real-time monitoring capabilities, and a professional enterprise interface.

## Features

- **Spark Jobs Management**: Create, edit, delete, and monitor Spark job configurations
- **Iceberg Tables Management**: Manage Iceberg table metadata and configurations  
- **VietinBank Branding**: Custom UI with VietinBank color scheme and branding
- **Form Validation**: Email validation for @vietinbank.vn domain, 8-digit chat IDs
- **Real-time Updates**: Live status toggling and data synchronization
- **PostgreSQL Integration**: Full database persistence with proper schema management

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query
- **Validation**: Zod schemas
- **Containerization**: Docker & Docker Compose

## Quick Start

### Using Docker (Recommended)

1. **Development Environment:**
```bash
# Start development environment with hot reload
docker-compose -f docker-compose.dev.yml up --build

# Access the application
http://localhost:5000
```

2. **Production Environment:**
```bash
# Start production environment
docker-compose up --build

# Access the application
http://localhost:5000
```

### Manual Setup

1. **Install Dependencies:**
```bash
npm install
```

2. **Setup Database:**
```bash
# Set environment variables
export DATABASE_URL="postgresql://username:password@localhost:5432/vietinbank_db"

# Push database schema
npm run db:push
```

3. **Start Development Server:**
```bash
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |

## Database Schema

### Spark Jobs (`spark_jobs`)
- `id`: Primary key
- `user_email`: User email (must end with @vietinbank.vn)
- `application_name`: Unique application identifier
- `chat_id`: 8-digit chat identifier
- `job_ram`: RAM allocation in GB
- `job_core`: CPU core count
- `job_executor`: Number of executors
- `is_active`: Job status toggle

### Iceberg Tables (`iceberg_tables`)
- `id`: Primary key  
- `table_name`: Unique table identifier
- `table_job_type`: Job type (STREAMING, BATCH, INCREMENTAL)
- `table_location`: Storage location path
- `is_active`: Table status toggle

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/spark-jobs` | List all Spark jobs |
| `POST` | `/api/spark-jobs` | Create new Spark job |
| `PUT` | `/api/spark-jobs/:id` | Update Spark job |
| `DELETE` | `/api/spark-jobs/:id` | Delete Spark job |
| `GET` | `/api/iceberg-tables` | List all Iceberg tables |
| `POST` | `/api/iceberg-tables` | Create new Iceberg table |
| `PUT` | `/api/iceberg-tables/:id` | Update Iceberg table |
| `DELETE` | `/api/iceberg-tables/:id` | Delete Iceberg table |

## Docker Configuration

The application includes both development and production Docker configurations:

- **`Dockerfile`**: Production build with multi-stage optimization
- **`Dockerfile.dev`**: Development build with hot reload
- **`docker-compose.yml`**: Production environment with PostgreSQL
- **`docker-compose.dev.yml`**: Development environment with volume mounts

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Database operations
npm run db:push    # Push schema changes
npm run db:studio  # Open Drizzle Studio

# Docker operations
docker-compose -f docker-compose.dev.yml up --build  # Dev environment
docker-compose up --build                            # Production environment
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/            # Utilities and configs
│   │   └── hooks/          # Custom React hooks
├── server/                 # Express backend
│   ├── db.ts               # Database connection (Neon)
│   ├── db-postgres.ts      # Database connection (PostgreSQL)
│   ├── routes.ts           # API routes
│   └── storage.ts          # Data access layer
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Drizzle schemas and Zod validation
├── docker-compose.yml      # Production Docker setup
├── docker-compose.dev.yml  # Development Docker setup
└── init.sql               # Database initialization
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker environment
5. Submit a pull request

## License

Private - VietinBank Internal Use Only