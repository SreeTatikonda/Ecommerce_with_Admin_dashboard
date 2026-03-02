# Architecture (MVP)

## Layered model
UI (Razor Views)
  -> Controllers
     -> Services (Business logic: cart, checkout, payments)
        -> Data (EF Core DbContext)
           -> PostgreSQL

## Notes
- Services are thin but isolate domain operations:
  - CartService: cart key handling (user or anon), item add/remove/update
  - OrderService: order creation, tax/shipping/discount calculation, mock payment
- Payment is a mock gateway to avoid PCI scope in the demo.
