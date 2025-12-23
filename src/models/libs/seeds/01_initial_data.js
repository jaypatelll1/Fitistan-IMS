// src/db/seeds/01_initial_data.js

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

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
  // INSERT USERS (Admin, Manager, Staff)
  // ========================================
  const adminpassword = await bcrypt.hash("Admin@123", 10);
  const managerpassword = await bcrypt.hash("Manager@123", 10);
  const staffpassword = await bcrypt.hash("Staff@123", 10);

  const adminId = uuidv4();
  const managerId = uuidv4();
  const staffId = uuidv4();

  await knex("users").insert([
    {
      user_id: adminId,
      email: "admin@fitistan.com",
      password: adminpassword,
      first_name: "Admin",
      last_name: "User",
      phone: "+91 98765 00000",
      role: "admin",
      status: "active",
      email_verified: true,
    },
    {
      user_id: managerId,
      email: "manager@fitistan.com",
      password: managerpassword,
      first_name: "Manager",
      last_name: "User",
      phone: "+91 98765 11111",
      role: "manager",
      status: "active",
      email_verified: true,
    },
    {
      user_id: staffId,
      email: "staff@fitistan.com",
      password: staffpassword,
      first_name: "Staff",
      last_name: "User",
      phone: "+91 98765 22222",
      role: "staff",
      status: "active",
      email_verified: true,
    },
  ]);

  console.log("✅ 3 Users created (Admin, Manager, Staff)");

  // ========================================
  // INSERT WAREHOUSE
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
  // INSERT ROOMS
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
  // INSERT VENDOR
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
  // INSERT SAMPLE PRODUCTS
  // ========================================
  const productIds = {
    tshirt: uuidv4(),
    bottle: uuidv4(),
    cap: uuidv4(),
  };

  await knex("products").insert([
    {
      product_id: productIds.tshirt,
      product_name: "Premium Cotton T-Shirt",
      category: "tshirt",
      vendor_id: vendorId,
      status: "active",
    },
    {
      product_id: productIds.bottle,
      product_name: "Stainless Steel Water Bottle",
      category: "bottle",
      vendor_id: vendorId,
      status: "active",
    },
    {
      product_id: productIds.cap,
      product_name: "Sports Cap",
      category: "cap",
      vendor_id: vendorId,
      status: "active",
    },
  ]);

  console.log("✅ 3 Products created");

  // ========================================
  // INSERT SAMPLE VARIANTS
  // ========================================
  const variantIds = {
    tshirt_black_m: uuidv4(),
    tshirt_white_l: uuidv4(),
    bottle_500ml: uuidv4(),
    cap_black: uuidv4(),
  };

  await knex("product_variants").insert([
    {
      variant_id: variantIds.tshirt_black_m,
      product_id: productIds.tshirt,
      sku: "TSHIRT-BLK-M-001",
      variant_name: "Black T-Shirt - Medium",
      attributes: JSON.stringify({
        size: "M",
        color: "Black",
        material: "100% Cotton",
      }),
      barcode: "1234567890123",
      status: "active",
    },
    {
      variant_id: variantIds.tshirt_white_l,
      product_id: productIds.tshirt,
      sku: "TSHIRT-WHT-L-001",
      variant_name: "White T-Shirt - Large",
      attributes: JSON.stringify({
        size: "L",
        color: "White",
        material: "100% Cotton",
      }),
      barcode: "1234567890124",
      status: "active",
    },
    {
      variant_id: variantIds.bottle_500ml,
      product_id: productIds.bottle,
      sku: "BOTTLE-SS-500-001",
      variant_name: "Steel Bottle 500ml",
      attributes: JSON.stringify({
        capacity: "500ml",
        material: "Stainless Steel",
        color: "Silver",
      }),
      barcode: "1234567890125",
      status: "active",
    },
    {
      variant_id: variantIds.cap_black,
      product_id: productIds.cap,
      sku: "CAP-BLK-OS-001",
      variant_name: "Black Sports Cap",
      attributes: JSON.stringify({
        size: "One Size",
        color: "Black",
        type: "Adjustable",
      }),
      barcode: "1234567890126",
      status: "active",
    },
  ]);

  console.log("✅ 4 Variants created");

  // ========================================
  // INSERT SAMPLE INVENTORY
  // ========================================
  await knex("inventory").insert([
    {
      variant_id: variantIds.tshirt_black_m,
      room_id: roomIds.general,
      quantity_on_hand: 100,
      reserved_quantity: 0,
      reorder_level: 20,
      status: "in_stock",
    },
    {
      variant_id: variantIds.tshirt_white_l,
      room_id: roomIds.general,
      quantity_on_hand: 75,
      reserved_quantity: 0,
      reorder_level: 15,
      status: "in_stock",
    },
    {
      variant_id: variantIds.bottle_500ml,
      room_id: roomIds.storage,
      quantity_on_hand: 200,
      reserved_quantity: 0,
      reorder_level: 50,
      status: "in_stock",
    },
    {
      variant_id: variantIds.cap_black,
      room_id: roomIds.storage,
      quantity_on_hand: 150,
      reserved_quantity: 0,
      reorder_level: 30,
      status: "in_stock",
    },
  ]);

  console.log("✅ 4 Inventory entries created");

  // ========================================
  // INSERT SAMPLE STOCK MOVEMENTS
  // ========================================
  await knex("stock_movements").insert([
    {
      variant_id: variantIds.tshirt_black_m,
      from_room_id: null,
      to_room_id: roomIds.general,
      movement_type: "inbound",
      quantity: 100,
      reason: "new_stock",
      performed_by: adminId,
      notes: "Initial stock entry - Black T-Shirt M",
    },
    {
      variant_id: variantIds.tshirt_white_l,
      from_room_id: null,
      to_room_id: roomIds.general,
      movement_type: "inbound",
      quantity: 75,
      reason: "new_stock",
      performed_by: managerId,
      notes: "Initial stock entry - White T-Shirt L",
    },
    {
      variant_id: variantIds.bottle_500ml,
      from_room_id: null,
      to_room_id: roomIds.storage,
      movement_type: "inbound",
      quantity: 200,
      reason: "new_stock",
      performed_by: adminId,
      notes: "Initial stock entry - Water Bottles",
    },
  ]);

  console.log("✅ 3 Stock movements created");

  console.log("\n🎉 Seed data completed successfully!\n");
  console.log("📊 Summary:");
  console.log("  • 3 Users (Admin, Manager, Staff)");
  console.log("  • 1 Warehouse");
  console.log("  • 3 Rooms");
  console.log("  • 1 Vendor");
  console.log("  • 3 Products with 4 Variants");
  console.log("  • 4 Inventory entries");
  console.log("  • 3 Stock movements\n");
  console.log("🔐 Login Credentials:");
  console.log("  Admin:   admin@fitistan.com / Admin@123");
  console.log("  Manager: manager@fitistan.com / Manager@123");
  console.log("  Staff:   staff@fitistan.com / Staff@123\n");
};
