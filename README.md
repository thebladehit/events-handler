# Events-handler
The system is a distributed microservices-based architecture built with NestJS, designed for event-driven communication using NATS JetStream, with persistence via PostgreSQL and Prisma ORM. It features structured, traceable logging and robust health checks for observability and reliability.

## Table of Contents

- [Components Description](#component-description)
  - [Publisher](#1-publisher)
  - [Gateway](#2-gateway)
  - [Fb-collector](#3-fb-collector)
  - [Ttk-collector](#4-ttk-collector)
  - [Reporter](#5-reporter)
  - [Nats](#6-nats)
  - [Postgres](#7-postgres)
  - [Prometheus](#8-prometheus)
  - [Grafana](#9-grafana)
- [Architecture Highlights](#architecture-highlights)
- [Stack](#stack)
- [How to run](#how-to-run)
- [Testing](#testing)

## Component Description
### 1. Publisher
Generates and sends events to endpoint define in `.env.publisher`.

### 2. Gateway
Gets events from `Publisher` via endpoint provided in `.env.publisher` and sends each event to appropriate Nats JetStream based on event `Source` type.

```ts
type Source = 'facebook' | 'tiktok';
```

### 3. Fb-collector
Pulls events from Nats JetStream and store them to DB.

### 4. Ttk-collector
Pulls events from Nats JetStream and store them to DB.

### 5. Reporter
Provide three endpoints for aggregated event statistics:
- `/reports/events` - events count statistic with parameters
- `/reports/revenue` - revenue event statistics with parameters
- `/reports/demographics` - demographics user statistics with parameters 

### 6. Nats
Provides JetStreams for storing events.

### 7. Postgres
Used for data storing.

### 8. Prometheus
Used for metrics collecting.

### 9. Grafana
Used for metrics visualization.

## Architecture Highlights
- Microservices: Each service is responsible for a distinct domain.
- Event-Driven Communication: Services interact asynchronously using `NATS` `JetStream`, with support for headers (e.g., correlation IDs) to ensure traceability.
- Database Layer: Uses `PostgreSQL` with `Prisma`.
- Health Monitoring: Implements liveness and readiness probes using `@nestjs/terminus`, with custom checks for Prisma connections and NATS availability.
- Structured Logging: Logging is centralized and consistent across services using `nestjs-pino`
- Docker Orchestration: Services are containerized and managed via Docker Compose
- Shared Utility Layer: A common library (`@app/common`) provides reusable modules for logging, health checks, NATS clients, and constants.

## Stack
- NestJS
- Prisma
- Nats JetStreams
- Postgres
- Docker
- Prometheus
- Grafana
- Pino/Logger

## How to run?
1. Create `.env.publisher` from `.env.publisher.example` template.
2. Create `./apps/fb-collector/.env` from `./apps/fb-collector/.env.example` template.
3. Create `./apps/ttk-collector/.env` from `./apps/ttk-collector/.env.example` template.
**Note**: `BATCH_SIZE` the number of events that the collector should read from the stream at one time.
4. Create `./apps/reporter/.env` from `./apps/reporter/.env.example` template.
5. Create `./apps/gateway/.env` from `./apps/gateway/.env.example` template.
6. Run `docker compose up`

## Testing
### Unit tests
Will add soon   
Run: `npm run test`

### Integration tests
Will add soon
Run: `npm run test`
