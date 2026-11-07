const nodemailer = require('nodemailer');

let transporterInstance = null;

/**
 * Get or create Nodemailer transporter
 */
const getTransporter = () => {
  if (transporterInstance) {
    return transporterInstance;
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = port === 465;

  if (host && user && pass) {
    transporterInstance = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
    return transporterInstance;
  }

  return null;
};

/**
 * Set a custom transporter (useful for unit/integration testing)
 */
const setTransporter = (transporter) => {
  transporterInstance = transporter;
};

/**
 * Generate GATHERLY branded HTML email template for OTP
 */
const generateResetEmailHtml = (otp, recipientName) => {
  const greetingName = recipientName ? recipientName.trim() : 'Campus Member';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your GATHERLY Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02); border: 1px solid #e2e8f0;">
          
          <!-- Brand Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 32px 28px; text-align: center;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center">
                <tr>
                  <td style="vertical-align: middle; padding-right: 12px;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; background-color: rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; text-align: center; line-height: 40px; font-size: 20px;">
                      🎪
                    </div>
                  </td>
                  <td style="vertical-align: middle; text-align: left;">
                    <span style="font-size: 24px; font-weight: 800; letter-spacing: 0.08em; color: #ffffff; text-transform: uppercase; display: block; line-height: 1.1;">GATHERLY</span>
                    <span style="font-size: 11px; font-weight: 500; letter-spacing: 0.12em; color: #c7d2fe; text-transform: uppercase;">Campus Life & Event Portal</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 36px 32px 28px 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a;">Password Reset Verification</h1>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                Hello <strong>${greetingName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                We received a request to reset your password for your GATHERLY campus account. Use the 6-digit verification code below to verify your identity and set a new password:
              </p>

              <!-- OTP Code Display -->
              <div style="background-color: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px 0;">
                <span style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; display: block; margin-bottom: 8px;">Verification Code</span>
                <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #4f46e5; display: inline-block;">
                  ${otp}
                </span>
              </div>

              <!-- Notice Box -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 12px 16px; margin: 0 0 24px 0;">
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #92400e;">
                  ⏱ <strong>Code expires in 10 minutes.</strong> Never share this code with anyone. GATHERLY staff will never ask for your verification code.
                </p>
              </div>

              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
                If you did not request this password reset, you can safely ignore this email. Your current password remains unchanged and secure.
              </p>

              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 28px 0 20px 0;">

              <!-- Support Info -->
              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #94a3b8; text-align: center;">
                Need help? Contact the campus IT helpdesk at <a href="mailto:support@gatherly.campus.edu" style="color: #4f46e5; text-decoration: none; font-weight: 500;">support@gatherly.campus.edu</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #94a3b8;">
                This is an automated security message from GATHERLY Campus Event Portal.
              </p>
              <p style="margin: 0; font-size: 12px; color: #cbd5e1;">
                © 2026 GATHERLY. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

/**
 * Send Password Reset OTP Email
 * @param {Object} options
 * @param {string} options.to Recipient email address
 * @param {string} options.otp 6-digit verification code
 * @param {string} [options.recipientName] Recipient full name
 * @returns {Promise<{success: boolean, simulated?: boolean, messageId?: string}>}
 */
const sendPasswordResetOtpEmail = async ({ to, otp, recipientName }) => {
  const from = process.env.SMTP_FROM || 'GATHERLY Security <security@gatherly.campus.edu>';
  const subject = `Your GATHERLY Verification Code: ${otp}`;
  const html = generateResetEmailHtml(otp, recipientName);
  const text = `Hello ${recipientName || 'Campus Member'},\n\nYour GATHERLY password reset code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this code, please ignore this email.\n\n— GATHERLY Campus Event Portal`;

  const transporter = getTransporter();

  if (!transporter) {
    console.warn('⚠️ [EmailService] SMTP credentials not configured. Simulating email delivery.');
    if (process.env.NODE_ENV !== 'production') {
      console.log('--------------------------------------------------');
      console.log(`📧 [Email Simulation] To: ${to}`);
      console.log(`📌 Subject: ${subject}`);
      console.log(`🔑 Verification Code: ${otp}`);
      console.log('⏰ Valid for 10 minutes');
      console.log('--------------------------------------------------');
    }
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log(`✅ [EmailService] Verification OTP sent successfully to ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ [EmailService] Failed to send email to ${to}:`, err.message);
    throw new Error('Unable to send verification email. Please try again later.');
  }
};

module.exports = {
  sendPasswordResetOtpEmail,
  getTransporter,
  setTransporter,
  generateResetEmailHtml,
};
