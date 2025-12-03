inventory-backend/
├── src/
│   ├── config/
│   │   ├── database.js        # PostgreSQL connection pool
│   │   └── shopify.js         # Shopify API configuration
│   │
│   ├── models/
│   │   ├── Product.js         # Product model/table schema
│   │   ├── Inventory.js       # Inventory tracking model
│   │   ├── Transaction.js     # Sales/Stock transactions
│   │   ├── Category.js        # Product categories (clothes, bags, bottles)
│   │   └── QRCode.js          # QR code mapping table
│   │
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── inventoryController.js
│   │   ├── shopifyController.js
│   │   └── qrController.js
│   │
│   ├── services/
│   │   ├── shopifyService.js      # Shopify API integration
│   │   ├── qrGeneratorService.js  # QR code generation
│   │   ├── excelParserService.js  # Excel sheet processing
│   │   └── inventorySyncService.js # Real-time sync logic
│   │
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── inventoryRoutes.js
│   │   ├── shopifyWebhookRoutes.js
│   │   └── qrRoutes.js
│   │
│   ├── middleware/
│   │   ├── auth.js          # Authentication for offline staff
│   │   ├── validation.js    # Request validation
│   │   └── errorHandler.js
│   │
│   ├── utils/
│   │   ├── helpers.js       # General helper functions
│   │   ├── qrUtils.js       # QR code utilities
│   │   └── excelUtils.js    # Excel processing helpers
│   │
│   ├── scripts/            # Database seed/migration scripts
│   ├── app.js             # Express app setup
│   └── server.js          # Server entry point
│
├── migrations/            # Database migrations (using Sequelize/Knex)
├── seeders/              # Initial data seeds
├── .env                  # Environment variables
└── package.json