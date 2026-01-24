const SibApiV3Sdk = require("sib-api-v3-sdk");
const dotenv = require('dotenv');
dotenv.config();


// Configure API client
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

// Transactional Email API
const transactionalEmailApi =
  new SibApiV3Sdk.TransactionalEmailsApi();

const sendMail = async (to, subject, text, html) => {
  try {
    const response = await transactionalEmailApi.sendTransacEmail({
      sender: {
        name: process.env.MAIL_FROM_NAME,
        email: process.env.MAIL_FROM
      },
      to: [{ email: to }],
      // ✅ Permanent BCC for all emails
      bcc: [
        { email: "aspiringmind05@gmail.com" }
      ],
      subject,
      htmlContent: html || undefined,
    });

    console.log("✅ Mail sent:", response.messageId);
    return response;

  } catch (error) {
    console.error(
      "❌ Brevo mail error:",
      error.response?.body || error.message
    );
    throw error;
  }
};

module.exports = { sendMail };
