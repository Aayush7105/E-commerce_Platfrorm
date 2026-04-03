# E-Commerce Platform

A full-stack e-commerce project with:

- A React + Vite frontend for browsing products
- An Express + MongoDB backend with product CRUD and filtering APIs

## Tech Stack

- Frontend: React 19, React Router, Tailwind CSS, Vite
- Backend: Node.js, Express, Mongoose, MongoDB

## Features

- Product listing powered by backend API
- Live search with debounce (`q` query param)
- Category, price range, and "new arrivals only" filters
- Sorting by newest, price, rating, and name
- Incremental "Load More" product grid
- Product CRUD API with validation
- Seed script to populate sample products

## Project Structure

```text
E-Commerce_Platform/
|-- src/                    # Frontend source
|-- public/                 # Frontend public assets
|-- backend/
|   |-- src/
|   |   |-- config/         # DB connection
|   |   |-- controllers/    # API logic
|   |   |-- data/           # Seed product data
|   |   |-- middleware/     # Error handling
|   |   |-- models/         # Mongoose models
|   |   |-- routes/         # Express routes
|   |   |-- scripts/        # Seed scripts
|   |   `-- server.js       # Backend entrypoint
|   |-- package.json
|   `-- README.md
|-- package.json
`-- README.md
```

## Prerequisites

- Node.js (recommended: 20+)
- npm
- MongoDB (local instance or MongoDB Atlas URI)

## Setup

### 1) Install dependencies

From project root:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

### 2) Configure environment variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_platform
```

Optional: create root `.env` if your API runs on a different host/port:

```env
VITE_API_URL=http://localhost:5000
```

If `VITE_API_URL` is not set, the frontend defaults to `http://localhost:5000`.

### 3) Run the backend

From `backend/`:

```bash
npm run dev
```

Backend health check:

- `http://localhost:5000/api/health`

### 4) Seed sample products (optional)

From `backend/`:

```bash
npm run seed
```

To clear all products:

```bash
npm run seed:clear
```

### 5) Run the frontend

From project root:

```bash
npm run dev
```

Frontend URL:

- `http://localhost:5173`

## Frontend Routes

- `/` home page with search, filters, sort, and product list
- `/collections`
- `/new-arrivals`
- `/about`
- `/contact`
- `/home` redirects to `/`
- `*` custom 404 page

## API Endpoints

Base URL: `http://localhost:5000`

- `GET /api/health`
- `GET /api/products`
- `GET /api/products?q=sneaker`
- `GET /api/products?search=sneaker` (alias of `q`)
- `GET /api/products?category=Footwear`
- `GET /api/products?minPrice=100&maxPrice=250`
- `GET /api/products?isNew=true`
- `GET /api/products?sort=newest`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

Supported `sort` values:

- `newest`
- `price-asc`
- `price-desc`
- `rating-desc`
- `name-asc`

Product fields:

- `name` (string, required)
- `category` (string, required)
- `price` (number, required)
- `rating` (number, default `0`)
- `image` (string, required)
- `isNew` (boolean, API output/input alias for DB field `isNewArrival`)
- `description` (string)
- `stock` (number)

## Scripts

Frontend (`/`):

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

Backend (`/backend`):

- `npm run dev`
- `npm run start`
- `npm run seed`
- `npm run seed:clear`
