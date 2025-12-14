Files to Create: (6 files)

src/models/variant.model.js
src/services/variant.service.js
src/controllers/variant.controller.js
src/routes/variant.routes.js
src/validators/variant.validator.js
src/utils/barcodeGenerator.js ← ALREADY PROVIDED!

API Endpoints: (9 endpoints)

POST   /api/v1/variants                - Create variant (auto-generates barcode)
GET    /api/v1/variants                - List all variants
GET    /api/v1/variants/:id            - Get variant details
PUT    /api/v1/variants/:id            - Update variant
DELETE /api/v1/variants/:id            - Delete variant
GET    /api/v1/variants/barcode/:code  - Find by barcode (SCANNING!)
POST   /api/v1/variants/:id/barcode    - Regenerate barcode
GET    /api/v1/variants/:id/qrcode     - Get QR code
GET    /api/v1/variants/:id/label      - Get printable label
