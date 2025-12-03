1. New Stock Entry Process:

Excel Sheet → Parse SKUs → Generate QR Codes → Print QR Labels
↓
Staff scans QR while unpacking → System creates/updates inventory
↓
Inventory count incremented → Transaction logged

2. Online Sale (Shopify):

Shopify Order Created → Webhook to your backend
↓
Extract line items/SKUs → Update inventory count
↓
Log transaction (source: 'shopify') → Update analytics

3. Offline Sale:
Staff scans product QR at POS → Identify product
↓
Update inventory (decrement) → Log transaction
↓
Generate receipt → Update daily sales report

4. Returns/Exchanges:
Scan QR → Identify original sale → Process return
↓
Update inventory → Log return transaction