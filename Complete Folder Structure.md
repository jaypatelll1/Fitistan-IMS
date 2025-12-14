src/
├
│ ├── config/
│ │ ├── database.js
│ │ └── clerk.js
│ │
│ ├── models/
│ │ ├── migrations/
│ │ │ ├── 01_create_warehouses.js
│ │ │ ├── 02_create_rooms.js
│ │ │ ├── 03_create_vendors.js
│ │ │ ├── 04_create_products.js
│ │ │ ├── 05_create_variants.js
│ │ │ ├── 06_create_inventory.js
│ │ │ └── 07_create_stock_movements.js
│ │ │
│ │ └── seeds/
│ │ ├── 01_warehouses.js
│ │ ├── 02_rooms.js
│ │ └── 03_initial_products.js
│ │
│ ├── middleware/
│ │ ├── auth.middleware.js
│ │ ├── validation.middleware.js
│ │ └── errorHandler.js
│ │
│ ├── validators/
│ │ ├── warehouse.validator.js
│ │ ├── room.validator.js
│ │ ├── vendor.validator.js
│ │ ├── product.validator.js
│ │ ├── variant.validator.js
│ │ └── inventory.validator.js
│ │
│ ├── models/
│ │ ├── warehouse.model.js
│ │ ├── room.model.js
│ │ ├── vendor.model.js
│ │ ├── product.model.js
│ │ ├── variant.model.js
│ │ └── inventory.model.js
│ │
│ ├── services/
│ │ ├── warehouse.service.js
│ │ ├── room.service.js
│ │ ├── vendor.service.js
│ │ ├── product.service.js
│ │ ├── variant.service.js
│ │ └── inventory.service.js
│ │
│ ├── controllers/
│ │ ├── warehouse.controller.js
│ │ ├── room.controller.js
│ │ ├── vendor.controller.js
│ │ ├── product.controller.js
│ │ ├── variant.controller.js
│ │ └── inventory.controller.js
│ │
│ ├── routes/
│ │ ├── index.js
│ │ ├── warehouse.routes.js
│ │ ├── room.routes.js
│ │ ├── vendor.routes.js
│ │ ├── product.routes.js
│ │ ├── variant.routes.js
│ │ └── inventory.routes.js
│ │
│ ├── utils/
│ │ ├── responseHandler.js
│ │ └── barcodeGenerator.js
│ │
│ └── app.js
│
├── knexfile.js
├── .env
├── package.json
└── server.js
