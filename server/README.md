# LifeOS AI Backend

Production-ready NestJS backend infrastructure for LifeOS AI.

## Tech Stack

- Node.js 22 LTS
- NestJS
- Prisma ORM
- PostgreSQL
- Redis
- Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js 22+
- Docker & Docker Compose
- npm 10+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration

### Development

Start the development server:
```bash
npm run docker:up
npm run dev
```

The API will be available at `http://localhost:3001/api/v1`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers
- `npm run docker:logs` - View Docker logs

### API Documentation

When running in development mode, Swagger documentation is available at:
`http://localhost:3001/api/docs`

### Health Check

Health endpoint available at:
`http://localhost:3001/health`

## Project Structure

```
server/
├── src/
│   ├── modules/
│   │   ├── auth/           # Authentication (placeholder)
│   │   ├── assistant/      # AI Assistant (placeholder)
│   │   ├── tasks/          # Tasks management (placeholder)
│   │   ├── knowledge/      # Knowledge base (placeholder)
│   │   ├── memory/         # Memory system (placeholder)
│   │   ├── journal/        # Journal entries (placeholder)
│   │   ├── users/          # User management (placeholder)
│   │   ├── notifications/  # Notifications (placeholder)
│   │   ├── search/         # Search functionality (placeholder)
│   │   ├── ai/             # AI Gateway (placeholder)
│   │   ├── gateway/        # API Gateway (placeholder)
│   │   ├── providers/      # AI Providers (placeholder)
│   │   ├── tools/          # Tool calling (placeholder)
│   │   ├── context/        # Context management (placeholder)
│   │   ├── prompt/         # Prompt management (placeholder)
│   │   ├── repositories/   # Data repositories (placeholder)
│   │   ├── database/       # Database services
│   │   └── common/         # Shared utilities
│   │       ├── config/     # Configuration modules
│   │       ├── middleware/ # Custom middleware
│   │       ├── guards/     # Route guards (placeholder)
│   │       ├── filters/    # Exception filters
│   │       ├── interceptors/ # Response interceptors
│   │       ├── decorators/ # Custom decorators (placeholder)
│   │       ├── events/     # Event handling (placeholder)
│   │       ├── storage/    # File storage (placeholder)
│   │       ├── jobs/       # Background jobs (placeholder)
│   │       └── health/     # Health checks
│   └── config/             # Configuration schemas
├── prisma/
│   └── schema.prisma       # Database schema
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Architecture

This is a production-ready NestJS backend with:

- **Security**: Helmet, CORS, Compression, Rate limiting
- **Validation**: Global validation pipe with class-validator
- **Error Handling**: Consistent API error format
- **Logging**: Request ID tracking, structured logging
- **Database**: Prisma ORM with PostgreSQL
- **Caching**: Redis integration
- **API Documentation**: Swagger/OpenAPI (development only)
- **Health Checks**: Database and Redis connectivity checks
- **Type Safety**: Full TypeScript with strict mode

## Environment Variables

See `.env.example` for all available configuration options.

## License

UNLICENSED - Proprietary software