<<<<<<< HEAD
# Ecommerce_wiith_Admin_dashboard
=======
# ECommerce .NET 8 MVP (Storefront + Admin) — Dockerized

This repository is a practical MVP for a **complete storefront** (catalog, cart, checkout, orders) with a **simple admin panel** (product/category CRUD).
It is designed to be runnable locally with **Docker Compose** and is structured to allow adding a separate SPA later.

## Stack (locked)
- .NET: **.NET 8**
- Web framework: **ASP.NET Core MVC** (Razor views)
- Data store: **PostgreSQL 16**
- ORM: **Entity Framework Core**
- Auth: **ASP.NET Core Identity (cookie-based)** + Roles (Admin)
- Payments: **Mock payment gateway** (PCI scope avoidance for demo)
- Deployment: **Docker Compose** (db + web)

## Quickstart (Docker)
1) Prereqs: Docker Desktop
2) Run:
```bash
docker compose up --build
```
3) Open:
- Storefront: http://localhost:8080
- Admin: http://localhost:8080/admin

### Default seeded accounts
- Admin:
  - Email: admin@example.com
  - Password: Admin123!
- Customer:
  - Email: user@example.com
  - Password: User123!

## Local (no Docker)
- Install .NET 8 SDK + PostgreSQL
- Set connection string in `src/ECommerce.Web/appsettings.Development.json`
- Run:
```bash
dotnet restore
dotnet run --project src/ECommerce.Web
```

## Data & schema
EF Core migrations are included in code as *model definitions*. For an MVP demo, the app uses **EnsureCreated()** at startup.
For production, replace with migrations:
```bash
dotnet ef migrations add InitialCreate -p src/ECommerce.Web -s src/ECommerce.Web
dotnet ef database update -p src/ECommerce.Web -s src/ECommerce.Web
```

## Notes
- **PCI**: No card data is stored/processed. Checkout uses a mock gateway that returns success/failure.
- Tax/shipping in MVP are basic placeholders.
>>>>>>> 63d30e6 (Initial commit:)
