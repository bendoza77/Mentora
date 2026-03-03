const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:   process.env.EMAIL_HOST,
    port:   process.env.EMAIL_PORT,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendPasswordResetEmail = async ({ to, name, resetURL }) => {
    const firstName = name?.split(' ')[0] || 'there';

    await transporter.sendMail({
        from:    `"Mentora AI" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to,
        subject: 'Reset your Mentora AI password',
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background:#070712;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070712;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#0D0D1F;border:1px solid #1A1A3E;border-radius:20px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#06b6d4);padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:28px;font-weight:900;color:#fff;letter-spacing:-0.5px;">
                Mentora <span style="opacity:0.85;">AI</span>
              </p>
              <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.75);letter-spacing:0.5px;">
                Your smart exam prep companion
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fff;">
                Hey ${firstName} 👋
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.6;">
                We received a request to reset your Mentora AI password. Click the button below to choose a new one.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding:8px 0 28px;">
                    <a href="${resetURL}" target="_blank"
                       style="display:inline-block;padding:16px 36px;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;font-size:15px;font-weight:700;text-decoration:none;border-radius:12px;letter-spacing:0.2px;">
                      Reset My Password →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Warning -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#1A1A3E;border-radius:10px;padding:16px 20px;">
                    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">
                      ⏱ This link expires in <strong style="color:#a78bfa;">10 minutes</strong>.<br/>
                      If you didn't request a password reset, you can safely ignore this email — your account is secure.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:12px;color:#334155;line-height:1.6;">
                Or copy and paste this URL into your browser:<br/>
                <span style="color:#7c3aed;word-break:break-all;">${resetURL}</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #1A1A3E;text-align:center;">
              <p style="margin:0;font-size:12px;color:#334155;">
                © ${new Date().getFullYear()} Mentora AI · All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });
};

module.exports = { sendPasswordResetEmail };
