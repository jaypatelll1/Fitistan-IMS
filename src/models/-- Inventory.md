-- Inventory (Stock in specific rooms)
inventory_id (PK, UUID)
variant_id (FK)
room_id (FK) -- Links to specific room in warehouse
quantity_on_hand
reserved_quantity
reorder_level
status (in_stock, low_stock, out_of_stock)
last_updated