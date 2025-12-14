Files to Create: (5 files)

src/models/vendor.model.js
src/services/vendor.service.js
src/controllers/vendor.controller.js
src/routes/vendor.routes.js
src/validators/vendor.validator.js

API Endpoints: (7 endpoints)

POST   /api/v1/vendors                 - Create vendor
GET    /api/v1/vendors                 - List all vendors
GET    /api/v1/vendors/:id             - Get vendor details
PUT    /api/v1/vendors/:id             - Update vendor
DELETE /api/v1/vendors/:id             - Delete vendor
GET    /api/v1/vendors/:id/products    - Get vendor products
PATCH  /api/v1/vendors/:id/status      - Update status
