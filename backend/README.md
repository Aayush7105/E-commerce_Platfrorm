# Backend (MongoDB + Products API)

This folder contains all database work for products using MongoDB.

## 1) Install backend dependencies

```bash
cd backend
npm install
```

## 2) Configure environment

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_platform
FRONTEND_URL=http://localhost:5173
```

## 3) Start backend server

```bash
npm run dev
```

Server URL: `http://localhost:5000`

## 4) Seed sample products

```bash
npm run seed
```

Clear products:

```bash
npm run seed:clear
```

## API Endpoints

- `GET /api/health`
- `GET /api/products`
- `GET /api/products?q=sneaker` (new multi-field search)
- `GET /api/products?search=sneaker` (backward-compatible alias)
- `GET /api/products?sort=price-asc` (sort: `newest`, `price-asc`, `price-desc`, `rating-desc`, `name-asc`)
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

Search now matches `name`, `category`, and `description`, and still works with
the existing query filters (`category`, `minPrice`, `maxPrice`, `isNew`).

### Example POST body

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
