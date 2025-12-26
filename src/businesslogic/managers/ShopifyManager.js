const axios = require("axios");

class ShopifyManager {
  static async processOrder(payload) {
    if (!payload || !payload.id) {
      throw new Error("Invalid Shopify payload");
    }

    const orderId = payload.id;
    const orderName = payload.name;
    const totalPrice = payload.total_price;
    const status = payload.financial_status;

    const customerName = payload.customer
      ? `${payload.customer.first_name} ${payload.customer.last_name}`
      : "Guest";

    const city = payload.shipping_address?.city || "N/A";

    if (!process.env.SLACK_WEBHOOK_URL) {
      throw new Error("SLACK_WEBHOOK_URL not configured");
    }

    const slackMessage = {
      text: `
🛒 *New Shopify Order*
• Order ID: ${orderId}
• Order No: ${orderName}
• Customer: ${customerName}
• Amount: ₹${totalPrice}
• Status: ${status}
• City: ${city}
      `,
    };

    await axios.post(process.env.SLACK_WEBHOOK_URL, slackMessage);
  }
}

module.exports = ShopifyManager;
