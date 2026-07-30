import dotenv from "dotenv";
dotenv.config();

/**
 * Send a WhatsApp Cloud API (Meta official) alert to the admin.
 *
 * Requires the following environment variables:
 *   WHATSAPP_TOKEN — permanent or temporary access token from Meta Business
 *   WHATSAPP_PHONE_NUMBER_ID — phone number ID from the WhatsApp Business API
 *   ADMIN_WHATSAPP_NUMBER — the admin's phone number in international format (e.g. 919876543210)
 *
 * @param {Object} params
 * @param {string} params.customerName
 * @param {string} params.customerMobile
 * @param {string} params.productName
 */
export const sendWhatsAppAlert = async ({ customerName, customerMobile, productName, isQuoteOnly }) => {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;

  if (!token || !phoneNumberId || !adminNumber) {
    console.log("📱 WhatsApp alert skipped — env vars not configured");
    console.log(`   Would have sent: Quote request from ${customerName} (${customerMobile}) for "${productName}"`);
    return;
  }

  const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
  
  const alertHeader = isQuoteOnly ? "🔔 New Enquiry (Quote Required)" : "🔔 New Enquiry (Priced Item)";

  const messageBody = {
    messaging_product: "whatsapp",
    to: adminNumber,
    type: "text",
    text: {
      body: `${alertHeader}\n\n` +
        `Product: ${productName}\n` +
        `Customer: ${customerName}\n` +
        `Mobile: ${customerMobile}\n\n` +
        `View request: https://sriramjewellery.com/dashboard/adminQuoteRequests`,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageBody),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`WhatsApp API error: ${response.status} — ${errorData}`);
  }

  console.log("✅ WhatsApp alert sent successfully");
  return response.json();
};
