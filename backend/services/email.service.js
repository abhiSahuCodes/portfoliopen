const nodemailer = require('nodemailer');

// Simple transporter configuration that works reliably
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class EmailService {
  get transporter() {
    return transporter;
  }

  async sendPasswordResetEmail(to, resetUrl) {
    const from = process.env.EMAIL_FROM || 'no-reply@portfoliopen.local';
    const appName = process.env.APP_NAME || 'PortfolioPen';

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your ${appName} account password. Click the button below to reset it.</p>
        <p><a href="${resetUrl}" style="display:inline-block; background:#4f46e5; color:#fff; padding:10px 16px; border-radius:6px; text-decoration:none;">Reset Password</a></p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire soon. If you didn't request a password reset, you can safely ignore this email.</p>
        <hr />
        <p style="color:#6b7280; font-size:12px;">&copy; ${new Date().getFullYear()} ${appName}</p>
      </div>
    `;

    try {
      console.log(`📧 Attempting to send password reset email to: ${to}`);
      const result = await this.transporter.sendMail({
        from,
        to,
        subject: `${appName} - Reset your password`,
        html,
      });
      console.log(`✅ Password reset email sent successfully to: ${to}`, result.messageId);
      return result;
    } catch (error) {
      console.error(`❌ Failed to send password reset email to: ${to}`, error);
      throw error;
    }
  }
}

module.exports = EmailService;