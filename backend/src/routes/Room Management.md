POST   /api/rooms                         # Create room
GET    /api/rooms                         # List all rooms (filter by warehouse)
GET    /api/rooms/:id                     # Get room details
PUT    /api/rooms/:id                     # Update room
DELETE /api/rooms/:id                     # Delete room
GET    /api/rooms/:id/inventory           # Get inventory in specific room
GET    /api/rooms/:id/utilization         # Get room utilization stats
PATCH  /api/rooms/:id/status              # Change room status (maintenance/active)
