# Backend API (Express + MongoDB)

This backend provides product APIs used by the frontend catalog/search UI.

## Requirements

- Node.js 20+
- npm
- MongoDB (local or Atlas)

## Setup

Install dependencies from the `backend` folder:

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_platform
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
REQUEST_LOGGING=true
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=120
TRUST_PROXY=false
HEALTH_INCLUDE_UPTIME=true
METRICS_INCLUDE_MEMORY=true
SHUTDOWN_TIMEOUT_MS=10000
```

Only `MONGO_URI` is required. `PORT` defaults to `5000` if omitted.
`CORS_ORIGIN` is optional and supports a comma-separated allowlist for browser origins.
`RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS` are optional and control in-memory rate limiting.
`HEALTH_INCLUDE_UPTIME` toggles uptime in `/api/health`.
`METRICS_INCLUDE_MEMORY` toggles memory metrics in `/api/metrics`.
`SHUTDOWN_TIMEOUT_MS` controls forced shutdown timeout for graceful shutdown.

## Run

Development mode (with auto-restart):

```bash
npm run dev
```

Production start:

```bash
npm run start
```

Base URL: `http://localhost:5000`

Health check:

- `GET /api/health`
- `GET /api/ready`

## Seed Data

Insert sample products:

```bash
npm run seed
```

Clear all products:

```bash
npm run seed:clear
```

## Scripts

- `npm run dev` -> start with nodemon
- `npm run start` -> start with node
- `npm run seed` -> clear and seed products
- `npm run seed:clear` -> remove all products

## API Endpoints

- `GET /api`
- `GET /api/health`
- `GET /api/ready`
- `GET /api/metrics`
- `GET /api/products`
- `GET /api/products/categories`
- `GET /api/products/stats`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### `GET /api/products` Query Params

- `q` or `search` -> text search across `name`, `category`, and `description`
- `category` -> case-insensitive exact category match (`all` disables category filter)
- `minPrice` -> minimum price
- `maxPrice` -> maximum price
- `minRating` -> minimum rating (`0` to `5`)
- `maxRating` -> maximum rating (`0` to `5`)
- `isNew` -> `true` or `false`
- `inStock` -> `true` (stock > 0) or `false` (stock <= 0)
- `sort` -> `newest`, `price-asc`, `price-desc`, `rating-desc`, `name-asc`
- `fields` -> comma-separated response fields (for example `name,price,image`)
- `page` -> optional page number for paginated response
- `limit` -> optional page size (`max: 100`) for paginated response

Example:

```http
GET /api/products?q=sneaker&category=Footwear&minPrice=100&maxPrice=300&isNew=true&sort=price-asc
```

```http
GET /api/products?page=1&limit=12
```

```http
GET /api/products?inStock=true&minRating=4&fields=name,price,rating,image
```

When `page` or `limit` is provided, the endpoint returns:

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

## Product Payload

Example create/update body:

```json
{
  "name": "Minimal Jacket",
  "category": "Clothing",
  "price": 120,
  "rating": 4.5,
  "image": "https://example.com/jacket.jpg",
  "isNew": true,
  "description": "Lightweight daily jacket.",
  "stock": 18
}
```

Response uses `isNew` as a boolean API field (stored internally as `isNewArrival`).

## Additional Product Endpoints

### `GET /api/products/categories`

Returns category counts for quick category navigation and faceting:

```json
{
  "categories": [
    { "name": "Footwear", "count": 8 },
    { "name": "Clothing", "count": 6 }
  ],
  "totalCategories": 2
}
```

### `GET /api/products/stats`

Returns catalog-level summary metrics and top-rated products.

Optional query param:

- `top` -> number of top-rated products to include (`max: 20`, default: `5`)

Example:

```http
GET /api/products/stats?top=3
```

## Error Format

Errors return JSON:

```json
{
  "message": "Error details",
  "stack": "..."
}
```

`stack` is omitted in production.
