# CeTe SaaS - Central Nervous System for MSEs

CeTe is a B2B SaaS platform designed and developed by the **Nexxus** team. Its purpose is to democratize logistics technology for Peruvian MSEs (Micro and Small Enterprises), unifying warehouse management, point of sale (POS), purchasing, and dispatch routes into a single "Central Nervous System".

The AV2 increment connects the application to the project's C# RESTful API and PostgreSQL. It adds partial purchase receiving, historical sales receipts, operational accounts, and improvements to internationalization and accessibility.

**Live application:** [CeTe Workspace](https://cete-web-av2.onrender.com/).

## Architecture and Technologies

The project applies principles of **Domain-Driven Design (DDD)** and **Hexagonal Architecture** to organize domain models, application state, infrastructure, and presentation. Procurement currently contains its initial presentation flow; context boundaries remain part of the architecture's evolution.

**Frontend Tech Stack:**

* **Framework:** Vue.js 3 (Composition API)
* **Build Tool:** Vite 8
* **State Management:** Pinia 4
* **UI Library:** PrimeVue 4 (MIT), Material theme, and PrimeFlex
* **HTTP Client:** Axios
* **Routing:** Vue Router 5 with hash-based navigation
* **Internationalization:** Vue I18n 11 with `en_US` and `es_419`
* **Backend Integration:** C# / ASP.NET Core RESTful API with PostgreSQL
* **Browser Verification:** Playwright 1.62.1

## Frontend Structure

```text
FrontEnd-CeTe/
  .github/
    workflows/                     # GitHub Pages deployment workflow
  public/                          # Public assets
  server/                          # Historical JSON-Server mock from TB1
    db.json                        # Mock data retained as a previous-stage reference
    routes.json                    # Historical mock route mapping
  src/
    iam/                           # Identity & Access Management
      domain/                      # Domain model
      application/                 # Authentication state and session management
      infrastructure/              # Authentication guard
      presentation/                # Sign-in, sign-up, team, and related components

    inventory/                     # Inventory Management
      domain/                      # InventoryItem entity
      application/                 # Inventory state and use cases
      infrastructure/              # Inventory API integration
      presentation/                # Catalogue forms, list, and stock movements

    procurement/                   # Purchasing and physical receiving
      presentation/                # Purchase orders and partial receiving

    logistics/                     # Dispatch Management
      domain/                      # Dispatch entity
      application/                 # Dispatch state and use cases
      infrastructure/              # Dispatch API integration
      presentation/                # Manifest form and route monitoring

    sales/                         # Sales and Point of Sale
      domain/                      # Sale and SaleItem entities
      application/                 # Sales state and use cases
      infrastructure/              # Sales API integration
      presentation/                # POS, sales history, cancellation, and receipts

    shared/                        # Cross-cutting concerns
      infrastructure/              # HTTP client, token, language, and error handling
      presentation/                # Layout, dashboard, language switcher, and footer

    locales/                       # English and Spanish dictionaries
    app.vue                        # Root component
    i18n.js                        # Vue I18n configuration
    main.js                        # Application initialization
    router.js                      # Main Vue Router configuration

  tests/
    browser/
      full-flow.cjs                # End-to-end browser verification
  .env.example                     # Public frontend configuration example
  vite.config.js                   # Vite and deployment base-path configuration
```

## Bounded Contexts (Modules)

The application is organized around five functional areas:

1. **IAM (Identity & Access Management):** Company registration, sign-in, revocable sessions, and employee accounts with operational roles.
2. **Inventory (Core Domain):** Product catalogue, SKU validation, stock entries and exits, movement history, and product archiving when stock is zero.
3. **Sales:** Point of Sale, server-validated stock and prices, sales history, cancellation, and historical receipts that can be viewed and printed.
4. **Logistics:** Dispatch manifests, association of sales, driver and vehicle assignment, and route status monitoring.
5. **Procurement:** Supplier purchase orders and partial physical receiving, with stock updated when goods arrive.

The dashboard presents company-specific sales and inventory indicators. English is the default interface language, and the selected Spanish or English preference persists across reloads.

## Installation and Setup Guide

Follow these steps to set up the local development environment.

### 1. Prerequisites

* **Node.js 22.12 or later**, with npm.
* **Docker**, to run the project's API and PostgreSQL locally.
* **Microsoft Edge on Windows**, or a prepared Playwright browser for end-to-end verification.

### 2. Install Dependencies

Open a terminal in the root of the frontend project and run:

```bash
npm ci
```

### 3. Start the RESTful API and Database

Follow the setup instructions in the [CeTe API repository](https://github.com/Nexxus-ops/CeTe-Api). From that repository, run:

```powershell
./Initialize-Local.ps1
docker compose up -d --build
```

The API is available at `http://localhost:5080/api/v1` and Swagger at `http://localhost:5080/swagger`. Keep these services running while using the frontend.

The `server/` mock files document the TB1 stage. The AV2 workflow uses the C# API and PostgreSQL.

### 4. Configure the API Connection

The default API URL is `http://localhost:5080/api/v1`. To change it, create `.env.local` in the frontend root, using `.env.example` as a reference:

```dotenv
VITE_PLATFORM_API_URL=http://localhost:5080/api/v1
VITE_LANDING_URL=https://cete-landing-av2.onrender.com/
VITE_BASE_PATH=/FrontEnd-CeTe/
```

These variables are public build configuration. Credentials and server secrets belong in the backend environment.

### 5. Run the Web Application (Frontend)

From the frontend root, run:

```bash
npm run dev
```

Open the URL displayed by Vite, typically [http://localhost:5173/FrontEnd-CeTe/](http://localhost:5173/FrontEnd-CeTe/).

Register a company with demonstration data to create its administrator account. The administrator can create Warehouse, Sales, and Logistics accounts from the Team module.

## AV2 Features and Improvements

* **Real Authentication:** API-validated credentials, token expiry, revocable sessions, and session data cleared when accounts change.
* **Purchasing and Receiving:** Purchase orders separated from physical receipts, including partial deliveries.
* **Sales Receipts:** Company, address, order, date and time in Lima, cashier, customer, products, quantities, prices, total, and recorded payment method.
* **Historical Data:** Receipt details remain tied to the original transaction when catalogue information changes.
* **Stock Consistency:** The backend confirms the sale, stock changes, recorded payment, and receipt in one transaction.
* **Error Feedback:** Visible messages for duplicate SKUs, rejected archiving, cancellation conflicts, and incomplete dispatch forms.
* **Accessibility and Responsive Design:** Labelled controls, keyboard product and sale selection, mobile receipt layout, and readable footer links.
* **Internationalization:** English and Latin American Spanish, with persistent language selection and links to bilingual landing resources.

Receipts and payment methods are part of the academic demonstration. The current increment records the selected payment method; it does not integrate a card payment gateway.

## Verification and Build

Build the application and inspect dependency advisories:

```bash
npm run build
npm audit
```

With the API and Vite running, execute the browser verification:

```bash
npm run test:e2e
```

On Linux, prepare the browser with `npx playwright install chromium`. On Windows, the test uses Edge. `CETE_BROWSER_CHANNEL` can select another installed browser channel.

To run the same verification against the public demonstration from PowerShell:

```powershell
$env:CETE_WEB_URL = "https://cete-web-av2.onrender.com/"
$env:CETE_API_URL = "https://cete-api-av2.onrender.com/api/v1"
npm run test:e2e
```

The suite creates a fictional company and operational account, then checks catalogue operations, duplicate SKU feedback, stock movements, employees, partial receiving, sales, receipts, printing, dispatches, cancellation, language, mobile layout, role guards, and logout revocation.

Use a demonstration environment. Credentials and tokens stay in memory; screenshots are written to `test-results/`, which is excluded from Git.

## Deployment Configuration

The current application is published as a **Render Static Site**. `VITE_BASE_PATH=/` serves the application at the site's root.

The repository also retains its **GitHub Pages** workflow. That deployment uses `/FrontEnd-CeTe/` and the repository variables `VITE_PLATFORM_API_URL` and `VITE_LANDING_URL`. Configure the public HTTPS API before publishing.

## Project Ecosystem

1. **[Landing Page](https://cete-landing-av2.onrender.com/):** Product presentation and access to the application. [Repository](https://github.com/Nexxus-ops/nexxus-landing-page).
2. **[Frontend](https://cete-web-av2.onrender.com/):** Transactional web application. [Repository](https://github.com/Nexxus-ops/FrontEnd-CeTe).
3. **[RESTful API](https://cete-api-av2.onrender.com/swagger):** C# services and PostgreSQL persistence. [Repository](https://github.com/Nexxus-ops/CeTe-Api).
4. **[Project Report](https://github.com/Nexxus-ops/Report-CeTe):** Requirements, design, planning, and academic evidence.

---

*Developed with responsibility, attention to detail, and care by the Nexxus team - 2026.*
