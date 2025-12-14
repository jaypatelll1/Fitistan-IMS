Files to Create: (5 files)

src/models/inventory.model.js
src/services/inventory.service.js
src/controllers/inventory.controller.js
src/routes/inventory.routes.js
src/validators/inventory.validator.js

API Endpoints: (10 endpoints)

POST   /api/v1/inventory/stock-in      - Add stock (receive inventory)
POST   /api/v1/inventory/stock-out     - Remove stock (sale/damage)
POST   /api/v1/inventory/transfer      - Transfer between rooms
GET    /api/v1/inventory               - List all inventory
GET    /api/v1/inventory/:id           - Get inventory details
GET    /api/v1/inventory/variant/:id   - Get by variant
GET    /api/v1/inventory/room/:id      - Get by room
GET    /api/v1/inventory/warehouse/:id - Get by warehouse
GET    /api/v1/inventory/low-stock     - Low stock alerts
GET    /api/v1/inventory/stats         - Inventory statistics
