# CeTe SaaS - Central Nervous System for MSEs

CeTe is a B2B SaaS platform designed and developed by the **Nexxus** team. Its purpose is to democratize logistics technology for Peruvian MSEs (Micro and Small Enterprises), unifying warehouse management, point of sale (POS), and dispatch routes into a single "Central Nervous System".

## Architecture and Technologies

The project is built following the principles of **Domain-Driven Design (DDD)** and **Hexagonal Architecture**, ensuring scalable, maintainable, and highly cohesive code.

**Frontend Tech Stack:**
* **Framework:** Vue.js 3 (Composition API)
* **Build Tool:** Vite
* **State Management:** Pinia
* **UI Library:** PrimeVue 4 + PrimeFlex
* **HTTP Client:** Axios
* **Routing:** Vue Router 4
* **Mock Backend:** JSON-Server v0.17.4

## Frontend Structure

```text
nexxus-ops-frontend-cete/
  .github/
    workflows/                     # CI/CD workflows (GitHub Actions)
  server/                          # Local test server (Mock API with json-server)
    db.json                        # Simulated JSON database
    routes.json                    # Mock API route mapping
  src/
    iam/                           # IAM bounded context (Identity & Access)
      domain/                      # Domain model (Entities, Commands)
      application/                 # Use-case orchestration (Pinia store)
      infrastructure/              # API, Assemblers, Guards, Interceptors, Resources
      presentation/                # Authentication routes, components, and views

    inventory/                     # Inventory bounded context (Inventory Management)
      domain/                      # InventoryItem entity
      application/                 # Inventory state and use cases (Pinia store)
      infrastructure/              # Inventory API and Assembler
      presentation/                # Routes and views (Form, List)

    logistics/                     # Logistics bounded context (Dispatch Management)
      domain/                      # Dispatch entity
      application/                 # Logistics state (Pinia store)
      infrastructure/              # Dispatch API and Assembler
      presentation/                # Dispatch routes and views

    sales/                         # Sales bounded context (Sales and Point of Sale)
      domain/                      # Sale and SaleItem entities
      application/                 # Sales state (Pinia store)
      infrastructure/              # Sales API and Assembler
      presentation/                # Routes and views (POS, Sales list)

    shared/                        # Cross-cutting concerns (Cross-context)
      infrastructure/              # HTTP base classes (BaseApi, BaseEndpoint)
      presentation/                # Global layout, Language switcher, Footer, and Base views

    locales/                       # Translations and internationalization (es.json, en.json)
    app.vue                        # Root main component
    i18n.js                        # Vue I18n configuration
    main.js                        # Entry point and app initialization
    pinia.js                       # Global Pinia instance
    router.js                      # Main Vue Router configuration
```

## Bounded Contexts (Modules)

The system is divided into 4 main bounded contexts:
1. **IAM (Identity & Access Management):** Security, authentication, login, and company registration (Tenants).
2. **Inventory (Core Domain):** Warehouse control, entry registration, shrinkage, and product catalog (SKUs).
3. **Sales:** Interactive Point of Sale (POS) that deducts stock in real-time and prevents stockouts.
4. **Logistics:** Generation of dispatch manifests and assignment of sales to vehicles en route.

## Installation and Setup Guide

Follow these steps to set up the local development environment.

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (Version 18 or higher).

### 2. Install Dependencies
Open a terminal in the root of the project and run:
```bash
npm install
```

### 3. Start the Simulated Database (Mock API)
The project uses `json-server` to simulate a relational database and a RESTful API.
Open a **new tab** in your terminal, navigate to the `server` folder, and run the server on port 5222:
```bash
cd server
npx json-server@0.17.4 --watch db.json --routes routes.json --port 5222
```
*Note: It is important to keep this terminal open so the frontend can save and query data.*

### 4. Run the Web Application (Frontend)
Return to your main terminal (in the project root) and run:
```bash
npm run dev
```

The application will be available in your browser, typically at `http://localhost:5173`.

---
*Developed with responsibility, attention to detail, and care by the Nexxus team - 2026.*
