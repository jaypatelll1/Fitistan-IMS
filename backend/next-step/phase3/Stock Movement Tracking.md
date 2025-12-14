Files to Create: (5 files)

src/models/stockMovement.model.js
src/services/stockMovement.service.js
src/controllers/stockMovement.controller.js
src/routes/stockMovement.routes.js
src/validators/stockMovement.validator.js

API Endpoints: (6 endpoints)

GET    /api/v1/movements               - List all movements
GET    /api/v1/movements/:id           - Get movement details
GET    /api/v1/movements/variant/:id   - Get by variant
GET    /api/v1/movements/user/:id      - Get by user
GET    /api/v1/movements/room/:id      - Get by room
GET    /api/v1/movements/report        - Generate report
