const ShopifyManager = require("../../../businesslogic/managers/ShopifyManager");
const {appWrapper} = require("../../routeWrapper");
const express = require("express");
const router = express.Router();

/**
 * Shopify Webhook
 * OPEN route – no roles required
 */
router.post(
  "/webhooks",
  appWrapper(async (req, res) => {
    await ShopifyManager.processOrder(req.body);

    return {
      success: true,
      message: "Shopify webhook received & Slack notified",
    };
  })
);

module.exports = router;
