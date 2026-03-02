# Testing plan (MVP)

## Unit tests
- OrderService calculations:
  - tax/shipping rules
  - coupon SAVE10
  - total correctness

## Integration tests
- Web endpoints (minimal):
  - catalog loads
  - add to cart -> cart shows items
  - checkout requires auth
  - order created and payment succeeds (mock)

## Code quality checks
- Enable analyzers (future)
- Add CI:
  - dotnet format (optional)
  - dotnet test
