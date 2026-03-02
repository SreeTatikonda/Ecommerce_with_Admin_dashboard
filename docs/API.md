# API Surface (MVP)

This MVP is MVC-first, but the intended API surface for later SPA/mobile integration is:

## Public
- GET /api/products
- GET /api/products/{id}
- GET /api/categories

## Cart (cookie/session)
- GET /api/cart
- POST /api/cart/items  (productId, qty)
- PATCH /api/cart/items/{productId} (qty)
- DELETE /api/cart/items/{productId}

## Checkout / Orders (authenticated)
- POST /api/checkout (shipping + coupon)
- POST /api/orders/{id}/pay (mock)
- GET /api/orders
- GET /api/orders/{id}

## Admin (Admin role)
- POST /api/admin/products
- PUT /api/admin/products/{id}
- DELETE /api/admin/products/{id}
- POST /api/admin/categories
- PUT /api/admin/categories/{id}
- DELETE /api/admin/categories/{id}
- GET /api/admin/orders
- PATCH /api/admin/orders/{id}/status

Auth model (locked for MVP): **ASP.NET Identity cookies**.
For token-based auth later: add JWT bearer and issue tokens on /api/auth/login.
