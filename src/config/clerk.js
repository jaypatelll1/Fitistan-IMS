// src/config/clerk.js
const { clerkClient } = require("@clerk/express");
const logger = require("../utils/logger");

// Validate Clerk environment variables
const requiredEnvVars = ["CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  logger.error(
    `❌ Missing required Clerk environment variables: ${missingVars.join(", ")}`
  );
  logger.error("Please add them to your .env file");
  process.exit(1);
}

// Clerk configuration
const clerkConfig = {
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
};

logger.info("✅ Clerk configuration loaded successfully");

module.exports = { clerkClient, clerkConfig };
