const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationCode(email, code) {
  await transporter.sendMail({
    from: `"EssayAI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your EssayAI account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="text-align:center;margin-bottom:20px;">
          <h1 style="color:#6366f1;margin:0;">EssayAI</h1>
        </div>
        <h2 style="color:#1e293b;">Email Verification</h2>
        <p style="color:#475569;">Your verification code is:</p>
        <div style="font-size:36px;font-weight:800;letter-spacing:10px;text-align:center;
                    padding:24px;background:#f1f5f9;border-radius:12px;color:#6366f1;margin:16px 0;">
          ${code}
        </div>
        <p style="color:#64748b;">This code expires in 10 minutes.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
        <p style="color:#94a3b8;font-size:13px;">
          If you didn't create an account with EssayAI, please ignore this email.
        </p>
      </div>
    `,
  });
}

module.exports = { sendVerificationCode };
