POST   /api/variants                      # Add variant
GET    /api/variants                      # List variants
GET    /api/variants/:id                  # Get variant
GET    /api/variants/barcode/:barcode     # Find by barcode (scanning)
PUT    /api/variants/:id                  # Update variant
DELETE /api/variants/:id                  # Delete variant
POST   /api/variants/:id/generate-barcode # Generate barcode
