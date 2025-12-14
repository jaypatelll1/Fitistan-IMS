Files to Create: (10 files)

src/models/warehouse.model.js
src/services/warehouse.service.js
src/controllers/warehouse.controller.js
src/routes/warehouse.routes.js
src/validators/warehouse.validator.js


API Endpoints: (8 endpoints)

POST   /api/v1/warehouses              - Create warehouse
GET    /api/v1/warehouses              - List all warehouses
GET    /api/v1/warehouses/:id          - Get warehouse details
PUT    /api/v1/warehouses/:id          - Update warehouse
DELETE /api/v1/warehouses/:id          - Delete warehouse
GET    /api/v1/warehouses/:id/rooms    - Get rooms in warehouse
GET    /api/v1/warehouses/:id/stats    - Warehouse statistics
PATCH  /api/v1/warehouses/:id/status   - Update status
