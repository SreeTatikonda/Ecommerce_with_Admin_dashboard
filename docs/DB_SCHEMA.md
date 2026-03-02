# Database schema (MVP)

## Identity tables (via ASP.NET Core Identity)
- AspNetUsers (AppUser)
- AspNetRoles
- AspNetUserRoles
- etc.

## App tables
### categories
- id (int, pk)
- name (text)
- slug (text, unique)

### products
- id (int, pk)
- name (text)
- slug (text, unique)
- description (text, nullable)
- price_cents (int)
- stock (int)
- is_active (bool)
- category_id (int, fk -> categories.id)

### carts
- id (int, pk)
- cart_key (text)  // "user:{userId}" or "anon:{cookieKey}"
- created_utc (timestamp)
- updated_utc (timestamp)

### cart_items
- id (int, pk)
- cart_id (int, fk -> carts.id)
- product_id (int, fk -> products.id)
- quantity (int)
- unit_price_cents (int)

### orders
- id (int, pk)
- user_id (text) // Identity user id
- created_utc (timestamp)
- status (int) // enum
- subtotal_cents, tax_cents, shipping_cents, discount_cents, total_cents (int)
- shipping_name, shipping_address1, shipping_city, shipping_state, shipping_postal_code (text)

### order_items
- id (int, pk)
- order_id (int, fk -> orders.id)
- product_id (int)
- product_name (text) // snapshot
- unit_price_cents (int)
- quantity (int)
- line_total_cents (int)

### payments
- id (int, pk)
- order_id (int, unique fk -> orders.id)
- status (int) // enum
- provider (text)
- provider_reference (text)
- created_utc (timestamp)
