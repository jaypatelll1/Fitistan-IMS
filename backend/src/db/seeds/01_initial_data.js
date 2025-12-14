// src/db/seeds/01_initial_data.js
const { v4: uuidv4 } = require("uuid");

exports.seed = async function (knex) {
  // Clear existing data (in reverse order of dependencies)
  await knex("stock_movements").del();
  await knex("inventory").del();
  await knex("product_variants").del();
  await knex("products").del();
  await knex("vendors").del();
  await knex("rooms").del();
  await knex("warehouses").del();
  await knex("users").del();

  console.log("🗑️  Cleared existing data");

  // ========================================
  // INSERT ADMIN USER
  // ========================================
  const adminId = uuidv4();
  await knex("users").insert({
    user_id: adminId,
    clerk_user_id: "user_temp_admin_" + Date.now(),
    email: "admin@inventory.com",
    first_name: "Admin",
    last_name: "User",
    phone: "+91 98765 00000",
    role: "admin",
    status: "active",
  });

  console.log("✅ Admin user created");

  // ========================================
  // INSERT WAREHOUSE (No manager fields)
  // ========================================
  const warehouseId = uuidv4();
  await knex("warehouses").insert({
    warehouse_id: warehouseId,
    warehouse_name: "Main Warehouse Mumbai",
    location: "Mumbai",
    address: "123 Industrial Area, Andheri East, Mumbai, Maharashtra 400069",
    total_capacity: 10000,
    status: "active",
  });

  console.log("✅ Warehouse created");

  // ========================================
  // INSERT ROOMS (No room_type, No temperature_range)
  // ========================================
  const roomIds = {
    general: uuidv4(),
    storage: uuidv4(),
    backup: uuidv4(),
  };

  await knex("rooms").insert([
    {
      room_id: roomIds.general,
      warehouse_id: warehouseId,
      room_number: "R-001",
      room_name: "General Storage A",
      capacity: 5000,
      current_utilization: 0,
      status: "active",
    },
    {
      room_id: roomIds.storage,
      warehouse_id: warehouseId,
      room_number: "R-002",
      room_name: "Storage Room B",
      capacity: 3000,
      current_utilization: 0,
      status: "active",
    },
    {
      room_id: roomIds.backup,
      warehouse_id: warehouseId,
      room_number: "R-003",
      room_name: "Backup Storage C",
      capacity: 2000,
      current_utilization: 0,
      status: "active",
    },
  ]);

  console.log("✅ 3 Rooms created");

  // ========================================
  // INSERT VENDOR (No address field)
  // ========================================
  const vendorId = uuidv4();
  await knex("vendors").insert({
    vendor_id: vendorId,
    vendor_name: "Premium Supplies Co.",
    contact_person: "Amit Shah",
    email: "amit@premiumsupplies.com",
    phone: "+91 98765 12345",
    status: "active",
  });

  console.log("✅ Vendor created");

  // ========================================
  // INSERT SAMPLE PRODUCT (No description field)
  // ========================================
  const productId = uuidv4();
  await knex("products").insert({
    product_id: productId,
    product_name: "Premium Cotton T-Shirt",
    category: "tshirt",
    vendor_id: vendorId,
    status: "active",
  });

  console.log("✅ Sample product created");

  // ========================================
  // INSERT SAMPLE VARIANT (No cost_price, No selling_price)
  // ========================================
  const variantId = uuidv4();
  await knex("product_variants").insert({
    variant_id: variantId,
    product_id: productId,
    sku: "TSHIRT-BLK-M-001",
    variant_name: "Black T-Shirt - Medium",
    attributes: JSON.stringify({
      size: "M",
      color: "Black",
      material: "100% Cotton",
    }),
    barcode: "1234567890123",
    status: "active",
  });

  console.log("✅ Sample variant created");

  // ========================================
  // INSERT SAMPLE INVENTORY
  // ========================================
  await knex("inventory").insert({
    variant_id: variantId,
    room_id: roomIds.general,
    quantity_on_hand: 100,
    reserved_quantity: 0,
    reorder_level: 20,
    status: "in_stock",
  });

  console.log("✅ Sample inventory created");

  // ========================================
  // INSERT SAMPLE STOCK MOVEMENT
  // ========================================
  await knex("stock_movements").insert({
    variant_id: variantId,
    from_room_id: null,
    to_room_id: roomIds.general,
    movement_type: "inbound",
    quantity: 100,
    reason: "new_stock",
    performed_by: adminId,
    notes: "Initial stock entry",
  });

  console.log("✅ Sample stock movement created");

  console.log("\n🎉 Seed data completed successfully!\n");
  console.log("📊 Summary:");
  console.log("   • 1 Admin user");
  console.log("   • 1 Warehouse");
  console.log("   • 3 Rooms");
  console.log("   • 1 Vendor");
  console.log("   • 1 Product with 1 Variant");
  console.log("   • 1 Inventory entry");
  console.log("   • 1 Stock movement\n");
};
