Files to Create: (5 files)

src/models/room.model.js
src/services/room.service.js
src/controllers/room.controller.js
src/routes/room.routes.js
src/validators/room.validator.js

API Endpoints: (8 endpoints)

POST   /api/v1/rooms                   - Create room
GET    /api/v1/rooms                   - List all rooms
GET    /api/v1/rooms/:id               - Get room details
PUT    /api/v1/rooms/:id               - Update room
DELETE /api/v1/rooms/:id               - Delete room
GET    /api/v1/rooms/:id/inventory     - Get room inventory
GET    /api/v1/rooms/:id/capacity      - Check capacity
PATCH  /api/v1/rooms/:id/status        - Update status
