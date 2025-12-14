Files to Create: (5 files)

src/models/product.model.js
src/services/product.service.js
src/controllers/product.controller.js
src/routes/product.routes.js
src/validators/product.validator.js

API Endpoints: (8 endpoints)

POST   /api/v1/products                - Create product
GET    /api/v1/products                - List all products
GET    /api/v1/products/:id            - Get product details
PUT    /api/v1/products/:id            - Update product
DELETE /api/v1/products/:id            - Delete product
GET    /api/v1/products/:id/variants   - Get product variants
GET    /api/v1/products/category/:cat  - Get by category
PATCH  /api/v1/products/:id/status     - Update status
