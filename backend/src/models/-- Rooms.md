-- Rooms (Sections within warehouse)
room_id (PK, UUID)
warehouse_id (FK)
room_number
room_name
room_type (cold_storage, dry_storage, general, fragile)
capacity
current_utilization
temperature_range (for cold storage)
status (active, maintenance, closed)
created_at
updated_at