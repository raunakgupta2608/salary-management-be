# Tech Stack

This document outlines the chosen technology stack for the application along with the rationale behind each decision.

---

## 1. Tech Stack

### Frontend

**Framework:** React (SPA)

We are using **React** as a Single Page Application (SPA) rather than Next.js because the application is an admin dashboard focused on internal usage.

#### Why React (not Next.js)?

- No requirement for Server-Side Rendering (SSR)
- No SEO concerns (internal/admin tool)
- Simpler architecture for dashboard-style apps
- Better separation of frontend and backend responsibilities
- Flexibility to fully control routing, state management, and data fetching

#### Suggested Supporting Libraries

- Routing: React Router
- State Management: Zustand / Redux Toolkit (depending on complexity)
- Data Fetching: React Query (TanStack Query)
- UI Library: MUI / Ant Design / Tailwind CSS (based on design preference)
- Build Tool: Vite (preferred over CRA for performance and DX)

---

### Backend

**Framework:** NestJS (Node.js)

We are using **NestJS** for the backend to ensure scalability, maintainability, and proper separation of concerns.

#### Why NestJS?

- Strong architectural pattern (modular, DI-based)
- Built-in support for scalable enterprise-grade applications
- Aligns well with multi-team backend development
- Easy integration with microservices if needed in future
- Clean separation between controllers, services, and repositories
- Better long-term maintainability compared to colocating APIs in Next.js

#### Suggested Supporting Tools

- ORM: Knex preferred for developer experience
- Auth: JWT + Refresh Token strategy (or OAuth if needed)
- Validation: class-validator + class-transformer
- API Documentation: Swagger (OpenAPI)

---

### Database

**Database:** PostgreSQL

We are choosing **PostgreSQL** as the primary relational database.

#### Why PostgreSQL?

- Strong support for relational data modeling
- Excellent support for joins and aggregations (required for analytics dashboards)
- ACID compliance ensures data reliability
- Supports JSONB for semi-structured data if needed later
- Highly scalable and widely adopted in production systems

#### Suggested Add-ons

- Connection pooling: PgBouncer (for production scale)
- Migrations: Knex Migrate
- Optional caching layer: Redis (for performance optimization)

---

## 2. Trade-offs

### Frontend (React SPA vs Next.js)

**Pros of React SPA:**

- Simpler architecture for admin dashboards
- No SSR complexity
- Faster development for internal tools
- Clear separation of concerns

**Cons:**

- Not optimized for SEO (not needed here)
- Initial load time slightly higher compared to SSR frameworks
- Requires proper client-side caching strategy

---

### Backend (NestJS vs Next.js API routes)

**Pros of NestJS:**

- Enterprise-grade architecture
- Better scalability for large teams
- Cleaner modular design
- Easier to extend with microservices later
- Strong TypeScript integration

**Cons:**

- Slightly higher initial setup complexity
- More boilerplate compared to Next.js API routes
- Requires separate deployment pipeline

---

### Database (PostgreSQL)

**Pros:**

- Excellent relational querying (joins, aggregations)
- Strong consistency and reliability
- Mature ecosystem and tooling
- Great support for analytics workloads

**Cons:**

- Horizontal scaling is more complex compared to NoSQL databases
- Requires schema design discipline upfront
- Performance tuning may be needed at scale

---

## Summary

This stack is optimized for:

- Internal/admin dashboard use case
- Scalability for future backend expansion
- Clean separation between frontend and backend teams
- Strong data querying capabilities for analytics-heavy features

Overall, the architecture prioritizes **maintainability, scalability, and long-term flexibility** over shortcut implementations.
