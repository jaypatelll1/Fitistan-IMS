const bcrypt = require("bcryptjs");

exports.up = async function (knex) {
  // First, check if there are any existing users
  const hasUsers = await knex("users").count("* as count").first();
  const userCount = parseInt(hasUsers.count);

  await knex.schema.table("users", (table) => {
    table.dropIndex("clerk_user_id");
    table.dropColumn("clerk_user_id");

    // Add password as NULLABLE first
    table.string("password", 255);
    table.string("refresh_token", 500);
    table.timestamp("password_changed_at");
    table.boolean("email_verified").defaultTo(false);
    table.string("verification_token", 100);
    table.timestamp("verification_token_expires");
    table.string("reset_password_token", 100);
    table.timestamp("reset_password_expires");
  });

  // If there are existing users, set a default password
  if (userCount > 0) {
    const defaultPassword = await bcrypt.hash("TempPassword123!", 10);
    await knex("users").whereNull("password").update({
      password: defaultPassword,
      email_verified: false,
    });

    console.log(
      `Updated ${userCount} existing users with temporary password: TempPassword123!`
    );
  }

  // Now make password NOT NULL
  await knex.raw("ALTER TABLE users ALTER COLUMN password SET NOT NULL");

  // Add indexes
  await knex.schema.table("users", (table) => {
    table.index([
      "refresh_token",
      "verification_token",
      "reset_password_token",
    ]);
  });
};

exports.down = async function (knex) {
  await knex.schema.table("users", (table) => {
    table.dropColumn("password");
    table.dropColumn("refresh_token");
    table.dropColumn("password_changed_at");
    table.dropColumn("email_verified");
    table.dropColumn("verification_token");
    table.dropColumn("verification_token_expires");
    table.dropColumn("reset_password_token");
    table.dropColumn("reset_password_expires");

    // Restore Clerk fields
    table.string("clerk_user_id", 100).notNullable().unique();
    table.index("clerk_user_id");
  });
};
