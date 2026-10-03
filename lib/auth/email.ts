import nodemailer from "nodemailer";
import { SITE_NAME } from "@/data/siteContent";

export type SendOtpEmailResult = {
  success: boolean;
  error?: string;
};

// Hook for test suites to intercept or mock email sending without network calls
type CustomEmailSender = (to: string, otp: string, memberName?: string) => Promise<boolean>;
let customEmailSender: CustomEmailSender | null = null;

export function setEmailSenderForTesting(sender: CustomEmailSender | null) {
  customEmailSender = sender;
}

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD
  );
}

/**
 * Creates Nodemailer SMTP transporter using standard environment variables.
 */
function createTransporter() {
  const host = process.env.SMTP_HOST || "";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASSWORD || "";

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    // Useful timeout defaults
    connectionTimeout: 10000,
    greetingTimeout: 5000,
  });
}

/**
 * Sends a 6-digit numeric login OTP email.
 */
export async function sendOtpEmail(
  toEmail: string,
  otp: string,
  memberName?: string
): Promise<SendOtpEmailResult> {
  // If unit testing hook is set, use it
  if (customEmailSender) {
    try {
      const ok = await customEmailSender(toEmail, otp, memberName);
      return ok
        ? { success: true }
        : { success: false, error: "We couldn't send the verification code. Please try again." };
    } catch {
      return { success: false, error: "We couldn't send the verification code. Please try again." };
    }
  }

  // If in test environment without SMTP credentials, simulate success
  if (process.env.NODE_ENV === "test" && !isSmtpConfigured()) {
    return { success: true };
  }

  // If SMTP is not yet configured in local development, log code to server console for testing
  if (!isSmtpConfigured()) {
    console.log(`\n==================================================`);
    console.log(`[SMTP DEV MODE - NO SMTP CREDENTIALS CONFIGURED]`);
    console.log(`To: ${toEmail}`);
    console.log(`Member: ${memberName || "Valued Member"}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Expires in: 5 minutes`);
    console.log(`Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD in .env for live email.`);
    console.log(`==================================================\n`);
    return { success: true };
  }

  try {
    const transporter = createTransporter();
    const fromAddress =
      process.env.SMTP_FROM || `"${SITE_NAME}" <no-reply@bestronggym.com>`;

    const subject = `Your ${SITE_NAME} Login OTP`;
    const greeting = memberName ? `Hi ${memberName},` : "Hello,";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F0EEE9; margin: 0; padding: 32px 16px;">
          <div style="max-width: 520px; margin: 0 auto; background-color: #FFFFFF; border-radius: 24px; border: 1px solid rgba(23,23,23,0.08); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
            <div style="background-color: #171717; padding: 24px 32px; text-align: center;">
              <h1 style="color: #FFFFFF; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; margin: 0;">${SITE_NAME}</h1>
              <p style="color: #A3A3A3; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 4px 0 0 0; font-weight: 700;">Member Portal Login</p>
            </div>
            
            <div style="padding: 36px 32px; color: #171717;">
              <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0; color: #171717;">${greeting}</p>
              <p style="font-size: 14px; line-height: 1.6; color: #5F5F5A; margin: 0 0 24px 0;">
                Here is your 6-digit one-time verification code to access your member dashboard:
              </p>

              <div style="background-color: #F8F6F2; border: 1px solid rgba(23,23,23,0.1); border-radius: 16px; padding: 20px; text-align: center; margin: 0 0 24px 0;">
                <span style="font-family: 'SF Mono', Monaco, Consolas, monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #171717; display: inline-block;">
                  ${otp}
                </span>
              </div>

              <div style="background-color: #F0EEE9; border-radius: 12px; padding: 12px 16px; margin: 0 0 24px 0;">
                <p style="font-size: 12px; color: #5F5F5A; margin: 0; line-height: 1.5;">
                  ⏱ <strong>This code expires in 5 minutes.</strong> For security, do not share this code with anyone.
                </p>
              </div>

              <p style="font-size: 12px; color: #8C8C85; margin: 0; line-height: 1.5;">
                If you did not request this login code, you can safely ignore this email.
              </p>
            </div>

            <div style="border-top: 1px solid rgba(23,23,23,0.06); padding: 18px 32px; background-color: #FAF9F6; text-align: center;">
              <p style="font-size: 11px; color: #8C8C85; margin: 0;">
                &copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `Your ${SITE_NAME} verification code: ${otp}\n\nThis code expires in 5 minutes.\nIf you did not request this code, you can safely ignore this email.`;

    await transporter.sendMail({
      from: fromAddress,
      to: toEmail,
      subject,
      text: textContent,
      html: htmlContent,
    });

    return { success: true };
  } catch (error) {
    console.error("[Email Delivery Error]:", error);
    return {
      success: false,
      error: "We couldn't send the verification code. Please try again.",
    };
  }
}
