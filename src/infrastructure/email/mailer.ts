import nodemailer, { type Transporter } from 'nodemailer';

/**
 * Email sender for the Armwrestling platform.
 *
 * Configuration is read from environment variables. If SMTP settings are not
 * present, the mailer runs in "console" mode: it logs the message instead of
 * sending it, so the rest of the app keeps working in local/dev without creds.
 *
 * To enable real sending, add to .env.local:
 *   SMTP_HOST="smtp.gmail.com"
 *   SMTP_PORT="465"
 *   SMTP_USER="you@gmail.com"
 *   SMTP_PASS="app-password"
 *   SMTP_FROM="Armwrestling League <you@gmail.com>"
 */

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null; // not configured -> console fallback
  }
  if (!transporter) {
    const port = Number(SMTP_PORT) || 587;
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<boolean> {
  const t = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@armwrestling.local';

  if (!t) {
    console.log('\n📧 [EMAIL — console fallback, SMTP not configured]');
    console.log('   To:     ', to);
    console.log('   Subject:', subject);
    console.log('   Body:   ', text || html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    console.log('');
    return false;
  }

  try {
    await t.sendMail({ from, to, subject, html, text });
    console.log(`📧 Email sent to ${to}: ${subject}`);
    return true;
  } catch (err) {
    console.error('📧 Email send failed:', err);
    return false;
  }
}

/** Notify an athlete that their competition registration was approved. */
export async function sendApprovalEmail(opts: {
  to: string;
  fullName: string;
  registrationId: string;
  tournamentTitle?: string;
}): Promise<boolean> {
  const { to, fullName, registrationId, tournamentTitle } = opts;
  const event = tournamentTitle ? `the <strong>${tournamentTitle}</strong>` : 'the';
  const subject = '✅ You have successfully applied for the Armwrestling Competition';
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#1f2937">
      <h2 style="color:#4338ca">Application Approved 💪</h2>
      <p>Dear <strong>${fullName}</strong>,</p>
      <p>Congratulations! You have <strong>successfully applied</strong> for ${event} Armwrestling Competition.
      Your payment has been received and verified by our team.</p>
      <p style="background:#eef2ff;padding:12px 16px;border-radius:8px">
        Your Registration ID: <strong>${registrationId}</strong>
      </p>
      <p>Please bring a valid ID on competition day. We will see you at the table!</p>
      <p style="margin-top:24px;color:#6b7280;font-size:13px">— Armwrestling League Organizing Committee</p>
    </div>`;
  const text = `Dear ${fullName},\n\nCongratulations! You have successfully applied for the Armwrestling Competition. Your payment has been received and verified.\n\nRegistration ID: ${registrationId}\n\n— Armwrestling League`;
  return sendEmail({ to, subject, html, text });
}

/** Notify an athlete that their registration was rejected. */
export async function sendRejectionEmail(opts: {
  to: string;
  fullName: string;
  registrationId: string;
  reason?: string;
}): Promise<boolean> {
  const { to, fullName, registrationId, reason } = opts;
  const subject = 'Update on your Armwrestling Competition application';
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#1f2937">
      <h2 style="color:#b91c1c">Application Update</h2>
      <p>Dear <strong>${fullName}</strong>,</p>
      <p>We are sorry to inform you that your application (<strong>${registrationId}</strong>) could not be approved at this time.</p>
      ${reason ? `<p>Reason: ${reason}</p>` : ''}
      <p>If you believe this is a mistake or your payment was valid, please contact the organizers.</p>
      <p style="margin-top:24px;color:#6b7280;font-size:13px">— Armwrestling League Organizing Committee</p>
    </div>`;
  const text = `Dear ${fullName},\n\nYour application (${registrationId}) could not be approved at this time.${reason ? `\nReason: ${reason}` : ''}\n\n— Armwrestling League`;
  return sendEmail({ to, subject, html, text });
}
