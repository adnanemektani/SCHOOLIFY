import "server-only";

type Mail = { to: string; subject: string; html: string };

async function sendEmail(message: Mail) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    console.info(`[mail:preview] ${message.subject} → ${message.to}`);
    return { delivered: false };
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, ...message }),
  });
  if (!response.ok) throw new Error("Email provider rejected the message.");
  return { delivered: true };
}

const appUrl = () => (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");

export async function sendRegistrationEmails(firstName: string, email: string, token: string) {
  const verificationUrl = `${appUrl()}/verify-email?token=${encodeURIComponent(token)}`;
  const confirmation = await sendEmail({
    to: email,
    subject: "Bienvenue chez Schoolify — confirmez votre email",
    html: `<h1>Bienvenue ${firstName} !</h1><p>Votre compte Schoolify a été créé avec succès.</p><p><a href="${verificationUrl}">Confirmer mon email</a></p><p>Ce lien expire dans 24 heures.</p>`,
  });
  const notify = process.env.STARTUP_NOTIFICATION_EMAIL
    ? sendEmail({
        to: process.env.STARTUP_NOTIFICATION_EMAIL,
        subject: "Nouvelle inscription Schoolify",
        html: `<p><strong>${firstName}</strong> vient de créer un compte avec ${email}.</p>`,
      }).catch(() => ({ delivered: false }))
    : Promise.resolve({ delivered: false });
  await notify;
  return confirmation;
}

export async function sendResetEmail(firstName: string, email: string, token: string) {
  const resetUrl = `${appUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  return sendEmail({
    to: email,
    subject: "Réinitialisez votre mot de passe Schoolify",
    html: `<h1>Bonjour ${firstName},</h1><p>Une demande de réinitialisation a été reçue.</p><p><a href="${resetUrl}">Choisir un nouveau mot de passe</a></p><p>Ce lien expire dans une heure. Si vous n'êtes pas à l'origine de la demande, ignorez cet email.</p>`,
  });
}
