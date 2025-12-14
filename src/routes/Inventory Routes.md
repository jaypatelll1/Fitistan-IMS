GET    /api/inventory                     # Get all inventory (with room & warehouse info)
GET    /api/inventory/:variantId          # Get inventory for variant (all rooms)
GET    /api/inventory/room/:roomId        # Get all inventory in room
POST   /api/inventory/stock-in            # Add stock to specific room
POST   /api/inventory/stock-out           # Remove stock from room (sale via barcode)
POST   /api/inventory/return              # Return stock to room
POST   /api/inventory/transfer            # Transfer stock between rooms
POST   /api/inventory/adjust              # Adjust quantity (damage/correction)
GET    /api/inventory/low-stock           # Get low stock items
GET    /api/inventory/movements/:variantId # Get stock movement history
GET    /api/inventory/movements/room/:roomId # Get movements for specific room
