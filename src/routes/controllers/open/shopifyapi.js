import axios from "axios";

// Shopify Webhook Handler

export const shopifyWebhookHandler = async (req, res) => {
  try {
    const payload = req.body;
    const orderId = payload.id;
    const orderName = payload.name;
    const totalPrice = payload.total_price;
    const status = payload.financial_status;
    const customerName = payload.customer
      ? `${payload.customer.first_name} ${payload.customer.last_name}`
      : "Guest";
    const city = payload.shipping_address?.city || "N/A";

    // Slack message
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

    // Send to Slack
    await axios.post(process.env.SLACK_WEBHOOK_URL, slackMessage);

    return res.status(200).json({
      success: true,
      message: "Shopify webhook mil gaya hai aur Slack pe bhej diya hai!",
    });
  } catch (error) {
    console.error("Shopify Webhook Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to process Shopify webhook",
    });
  }
};

// Shopify order → backend webhook → formatted Slack notification 
// this is the flow