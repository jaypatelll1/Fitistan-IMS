1. Products Table

id: UUID (primary key)
sku: VARCHAR(100) UNIQUE NOT NULL
name: VARCHAR(255)
description: TEXT
category_id: INTEGER (foreign key)
price: DECIMAL(10,2)
cost_price: DECIMAL(10,2)
size: VARCHAR(50)  # S, M, L, XL
color: VARCHAR(50)
brand: VARCHAR(100)
supplier_id: INTEGER
created_at: TIMESTAMP
updated_at: TIMESTAMP
metadata: JSONB  # For future extensibility

2. inventory

id: UUID (primary key)
product_id: UUID (foreign key)
warehouse_location: VARCHAR(100)  # "Main Store", "Warehouse A"
current_stock: INTEGER DEFAULT 0
reserved_stock: INTEGER DEFAULT 0  # For pending orders
minimum_stock_level: INTEGER
last_restocked: TIMESTAMP
status: ENUM('active', 'discontinued', 'out_of_stock')


3. categories

id: SERIAL (primary key)
name: VARCHAR(100)  # "Clothes", "Bags", "Bottles"
parent_category_id: INTEGER (self-referencing)
description: TEXT
attributes: JSONB  # For category-specific attributes


4. qr_codes

id: UUID (primary key)
product_id: UUID (foreign key)
qr_code_hash: VARCHAR(255) UNIQUE  # Unique identifier in QR
qr_code_image_url: VARCHAR(500)  # Storage path/URL
is_active: BOOLEAN DEFAULT true
created_at: TIMESTAMP

5. sales
id: UUID (primary key)
transaction_id: UUID (foreign key to transactions)
sale_channel: ENUM('shopify', 'offline')
customer_id: INTEGER (optional)
total_amount: DECIMAL(10,2)
payment_method: VARCHAR(50)
sale_timestamp: TIMESTAMP