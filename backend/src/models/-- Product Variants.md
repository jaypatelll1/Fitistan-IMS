-- Product Variants
variant_id (PK, UUID)
product_id (FK)
sku (unique, indexed)
variant_name
attributes (JSONB: {size, color, material})
cost_price
selling_price
barcode (unique, indexed)
status (active, inactive)
created_at
updated_at