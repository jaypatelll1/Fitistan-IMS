-- Stock Movements
movement_id (PK, UUID)
variant_id (FK)
from_room_id (FK, nullable) -- For transfers
to_room_id (FK, nullable) -- For transfers
movement_type (inbound, outbound, transfer, adjustment)
quantity
reason (new_stock, sale, return, damage, transfer, correction)
performed_by (clerk_user_id)
notes
created_at
