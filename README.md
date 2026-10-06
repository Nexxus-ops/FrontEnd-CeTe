# CeTe SaaS - Sistema Nervioso Central para MYPES

CeTe es una plataforma B2B SaaS diseñada y desarrollada por el equipo **Nexxus**. Su propósito es democratizar la tecnología logística para las MYPES peruanas, unificando en un solo "Sistema Nervioso Central" la gestión de almacenes, el punto de venta (POS) y las rutas de despacho.

##  Arquitectura y Tecnologías

El proyecto está construido bajo los principios de **Domain-Driven Design (DDD)** y **Arquitectura Hexagonal**, garantizando un código escalable, mantenible y altamente cohesivo.

**Tech Stack Frontend:**
* **Framework:** Vue.js 3 (Composition API)
* **Build Tool:** Vite
* **State Management:** Pinia
* **UI Library:** PrimeVue 4 + PrimeFlex
* **HTTP Client:** Axios
* **Routing:** Vue Router 4
* **Mock Backend:** JSON-Server v0.17.4

## Bounded Contexts (Módulos)

El sistema está dividido en 4 contextos delimitados principales:
1. **IAM (Identity & Access Management):** Seguridad, autenticación, login y registro de empresas (Tenants).
2. **Inventory (Core Domain):** Control de almacén, registro de ingresos, mermas y catálogo de productos (SKUs).
3. **Sales:** Punto de Venta (POS) interactivo que descuenta stock en tiempo real y previene quiebres.
4. **Logistics:** Generación de manifiestos de despacho y asignación de ventas a vehículos en ruta.

## Guía de Instalación y Ejecución

Sigue estos pasos para levantar el entorno de desarrollo local.

### 1. Requisitos Previos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (Versión 18 o superior).

### 2. Instalación de Dependencias
Abre una terminal en la raíz del proyecto y ejecuta:
```bash
npm install
```

### 3. Levantar la Base de Datos Simulada (Mock API)
El proyecto utiliza `json-server` para simular una base de datos relacional y una API RESTful.
Abre una **nueva pestaña** en tu terminal, ingresa a la carpeta `server` y ejecuta el servidor en el puerto 5222:
```bash
cd server
npx json-server@0.17.4 --watch db.json --routes routes.json --port 5222
```
*Nota: Es importante mantener esta terminal abierta para que el frontend pueda guardar y consultar datos.*

### 4. Ejecutar la Aplicación Web (Frontend)
Regresa a tu terminal principal (en la raíz del proyecto) y ejecuta:
```bash
npm run dev
```

La aplicación estará disponible en tu navegador, generalmente en `http://localhost:5173`.

---
*Desarrollado con responsabilidad, detalle y cariño por el equipo Nexxus - 2026.*