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
```

Only `MONGO_URI` is required. `PORT` defaults to `5000` if omitted.
`CORS_ORIGIN` is optional and supports a comma-separated allowlist for browser origins.
`RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS` are optional and control in-memory rate limiting.

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

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### `GET /api/products` Query Params

- `q` or `search` -> text search across `name`, `category`, and `description`
- `category` -> case-insensitive exact category match (`all` disables category filter)
- `minPrice` -> minimum price
- `maxPrice` -> maximum price
- `isNew` -> `true` or `false`
- `sort` -> `newest`, `price-asc`, `price-desc`, `rating-desc`, `name-asc`
- `page` -> optional page number for paginated response
- `limit` -> optional page size (`max: 100`) for paginated response

Example:

```http
GET /api/products?q=sneaker&category=Footwear&minPrice=100&maxPrice=300&isNew=true&sort=price-asc
```

```http
GET /api/products?page=1&limit=12
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

## Error Format

Errors return JSON:

```json
{
  "message": "Error details",
  "stack": "..."
}
```

`stack` is omitted in production.
