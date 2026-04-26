# E-Commerce Platform

A full-stack e-commerce catalog application built with React, Vite, Express, and MongoDB.

The project includes a browsable storefront UI, product search and filtering, reusable catalog routes, backend product CRUD APIs, health/readiness endpoints, request logging, rate limiting, and sample product seeding.

## Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Frontend Routes](#frontend-routes)
- [API Reference](#api-reference)
- [Product Data Model](#product-data-model)
- [Development Notes](#development-notes)
- [Troubleshooting](#troubleshooting)

## Features

- Product listing powered by the backend API
- Live catalog search with debounced requests
- Category, price, rating, stock, and new-arrival filters
- Sorting by newest, price, rating, and product name
- Incremental product loading in the storefront
- Product create, read, update, and delete API endpoints
- Category aggregation endpoint
- Catalog analytics endpoint
- Backend health, readiness, and metrics endpoints
- Request logging, security headers, CORS configuration, and rate limiting
- MongoDB seed script for sample products
- Custom 404 page and route redirects

## Tech Stack

### Frontend

- React 19
- React Router
- React Icons
- Tailwind CSS
- Vite
- ESLint

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- CORS
- dotenv
- Nodemon

## Project Structure

```text
E-Commerce_Platform/
|-- public/                    # Static frontend assets
|-- src/                       # React frontend source
|   |-- components/            # UI components and pages
|   |-- App.jsx                # Frontend route definitions
|   `-- main.jsx               # Frontend entrypoint
|-- backend/
|   |-- src/
|   |   |-- config/            # MongoDB connection
|   |   |-- controllers/       # API controller logic
|   |   |-- data/              # Seed product data
|   |   |-- middleware/        # Error, logging, and rate-limit middleware
|   |   |-- models/            # Mongoose schemas and models
|   |   |-- routes/            # Express route definitions
|   |   |-- scripts/           # Database seed scripts
|   |   `-- server.js          # Backend entrypoint
|   |-- package.json
|   `-- README.md
|-- package.json
`-- README.md
```

## Prerequisites

- Node.js 20 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Quick Start

From the repository workspace, move into the application folder:

```bash
cd E-Commerce_Platform
```

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_platform
CORS_ORIGIN=http://localhost:5173
REQUEST_LOGGING=true
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=120
HEALTH_INCLUDE_UPTIME=true
METRICS_INCLUDE_MEMORY=true
SHUTDOWN_TIMEOUT_MS=10000
```

Optional: create `.env` in the project root if the frontend should call a different API URL:

```env
VITE_API_URL=http://localhost:5000
```

Seed sample products:

```bash
npm run seed
```

Start the backend from `backend/`:

```bash
npm run dev
```

In a second terminal, start the frontend from the project root:

```bash
npm run dev
```

Open the app:

```text
http://localhost:5173
```

Backend base URL:

```text
http://localhost:5000
```

## Environment Variables

### Frontend

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `VITE_API_URL` | No | `http://localhost:5000` | Base URL used by the React app when calling the backend API. |

### Backend

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `PORT` | No | `5000` | Port used by the Express server. |
| `MONGO_URI` | Yes | None | MongoDB connection string. |
| `CORS_ORIGIN` | No | Allows all origins | Comma-separated list of allowed browser origins. |
| `REQUEST_LOGGING` | No | `true` outside tests | Enables request logging middleware. |
| `TRUST_PROXY` | No | `false` | Enables Express trust proxy behavior. |
| `RATE_LIMIT_WINDOW_MS` | No | `60000` | Rate-limit window in milliseconds. |
| `RATE_LIMIT_MAX_REQUESTS` | No | `120` | Maximum requests per IP during the rate-limit window. |
| `JSON_BODY_LIMIT` | No | `100kb` | Maximum JSON request body size. |
| `URLENCODED_BODY_LIMIT` | No | `100kb` | Maximum URL-encoded request body size. |
| `HEALTH_INCLUDE_UPTIME` | No | `true` | Adds process uptime to the health response. |
| `METRICS_INCLUDE_MEMORY` | No | `true` | Adds memory usage to the metrics response. |
| `SHUTDOWN_TIMEOUT_MS` | No | `10000` | Timeout for graceful shutdown cleanup. |

## Available Scripts

### Frontend

Run these from the project root.

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Build the frontend for production. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint across the frontend project. |

### Backend

Run these from `backend/`.

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Express API with Nodemon. |
| `npm run start` | Start the Express API with Node. |
| `npm run seed` | Insert sample products into MongoDB. |
| `npm run seed:clear` | Remove seeded products from MongoDB. |

## Frontend Routes

| Route | Description |
| --- | --- |
| `/` | Home page with product search, filters, sorting, and catalog grid. |
| `/collections` | Collections page. |
| `/new-arrivals` | New arrivals page. |
| `/best-sellers` | Best sellers page. |
| `/sale` | Sale page. |
| `/about` | About page. |
| `/faq` | FAQ page. |
| `/contact` | Contact page. |
| `/wishlist` | Wishlist page. |
| `/home` | Redirects to `/`. |
| `*` | Custom 404 page. |

## API Reference

Base URL:

```text
http://localhost:5000
```

### Service Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api` | Service metadata and endpoint list. |
| `GET` | `/api/health` | Health check for the backend process and database state. |
| `GET` | `/api/ready` | Readiness check. Returns `503` if MongoDB is not connected. |
| `GET` | `/api/metrics` | Runtime process metrics. |

### Product Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/products` | List products. Supports filtering, sorting, pagination, and field selection. |
| `GET` | `/api/products/categories` | Get product categories with product counts. |
| `GET` | `/api/products/stats` | Get catalog summary metrics and top-rated products. |
| `GET` | `/api/products/:id` | Get a product by MongoDB ObjectId. |
| `POST` | `/api/products` | Create a product. |
| `PUT` | `/api/products/:id` | Update a product. |
| `DELETE` | `/api/products/:id` | Delete a product. |

### Product Query Parameters

| Parameter | Example | Description |
| --- | --- | --- |
| `q` | `/api/products?q=sneaker` | Search name, category, and description. |
| `search` | `/api/products?search=sneaker` | Alias for `q`. |
| `category` | `/api/products?category=Footwear` | Filter by category. Case-insensitive. |
| `minPrice` | `/api/products?minPrice=50` | Minimum product price. |
| `maxPrice` | `/api/products?maxPrice=250` | Maximum product price. |
| `minRating` | `/api/products?minRating=4` | Minimum rating from `0` to `5`. |
| `maxRating` | `/api/products?maxRating=5` | Maximum rating from `0` to `5`. |
| `inStock` | `/api/products?inStock=true` | Filter products by stock availability. |
| `isNew` | `/api/products?isNew=true` | Filter products by new-arrival status. |
| `sort` | `/api/products?sort=price-asc` | Sort products. |
| `page` | `/api/products?page=1` | Enables paginated response. |
| `limit` | `/api/products?limit=12` | Page size. Maximum value is `100`. |
| `fields` | `/api/products?fields=name,price,rating` | Return only selected product fields. |

Supported `sort` values:

```text
newest
price-asc
price-desc
rating-desc
name-asc
```

Field selection supports:

```text
_id
id
name
category
price
rating
image
isNew
isNewArrival
description
stock
createdAt
updatedAt
```

### Example Requests

List newest products:

```bash
curl http://localhost:5000/api/products
```

Search and filter products:

```bash
curl "http://localhost:5000/api/products?q=sneaker&minPrice=50&maxPrice=250&inStock=true&sort=rating-desc"
```

Get paginated products:

```bash
curl "http://localhost:5000/api/products?page=1&limit=12"
```

Create a product:

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Classic Sneaker",
    "category": "Footwear",
    "price": 129.99,
    "rating": 4.6,
    "image": "https://example.com/sneaker.jpg",
    "isNew": true,
    "description": "A clean everyday sneaker.",
    "stock": 25
  }'
```

When `page` or `limit` is provided, the list endpoint returns:

```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "totalItems": 0,
    "totalPages": 0,
    "hasPreviousPage": false,
    "hasNextPage": false
  }
}
```

Without pagination parameters, `/api/products` returns a plain array of products.

## Product Data Model

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | String | Yes | Product name. |
| `category` | String | Yes | Product category. |
| `price` | Number | Yes | Must be greater than or equal to `0`. |
| `rating` | Number | No | Defaults to `0`. Must be between `0` and `5`. |
| `image` | String | Yes | Product image URL. |
| `isNew` | Boolean | No | API alias for the database field `isNewArrival`. |
| `description` | String | No | Defaults to an empty string. |
| `stock` | Number | No | Defaults to `0`. Must be greater than or equal to `0`. |
| `createdAt` | Date | No | Added by Mongoose timestamps. |
| `updatedAt` | Date | No | Added by Mongoose timestamps. |

## Development Notes

- Start MongoDB before running the backend.
- The backend loads environment variables from `backend/.env`.
- The frontend reads `VITE_API_URL` from the root `.env` file.
- If `VITE_API_URL` is not set, the frontend calls `http://localhost:5000`.
- Health, readiness, and metrics endpoints are skipped by the backend rate limiter.
- `CORS_ORIGIN` can contain multiple origins separated by commas.
- Product search is trimmed, normalized, and limited before being converted into MongoDB regex filters.
- Product responses expose `isNew`; the internal MongoDB field is `isNewArrival`.

## Troubleshooting

### The frontend cannot load products

- Confirm the backend is running on `http://localhost:5000`.
- Confirm MongoDB is running and `MONGO_URI` is correct.
- Check `VITE_API_URL` if the backend uses a different host or port.
- Make sure `CORS_ORIGIN` includes `http://localhost:5173`.

### The backend fails to start

- Confirm `backend/.env` exists.
- Confirm `MONGO_URI` points to a reachable MongoDB database.
- Run `npm install` inside `backend/`.

### The catalog is empty

- Run the seed command from `backend/`:

```bash
npm run seed
```

### Port already in use

- Change `PORT` in `backend/.env` for the API.
- If the frontend port is busy, Vite will suggest another available local URL.
