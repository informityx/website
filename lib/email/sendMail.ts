import type { SendMailOptions as NodemailerSendMailOptions } from "nodemailer"
import { getEmailConfig } from "./config"
import { getMailTransporter } from "./transporter"

export type SendMailOptions = {
  to?: string | string[]
  subject: string
  text: string
  html?: string
  replyTo?: string
}

export type SendMailResult =
  | { ok: true; messageId: string }
  | { ok: false; skipped: true; reason: string }
  | { ok: false; skipped: false; error: string }

export async function sendMail(options: SendMailOptions): Promise<SendMailResult> {
  const config = getEmailConfig()
  if (!config) {
    return {
      ok: false,
      skipped: true,
      reason: "SMTP is not configured (set SMTP_HOST, SMTP_USER, SMTP_PASSWORD, etc.)",
    }
  }

  const transporter = getMailTransporter()
  if (!transporter) {
    return {
      ok: false,
      skipped: true,
      reason: "Mail transporter could not be created",
    }
  }

  const mailOptions: NodemailerSendMailOptions = {
    from: `"${config.fromName}" <${config.from}>`,
    to: options.to ?? config.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    replyTo: options.replyTo,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    return { ok: true, messageId: info.messageId }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown mail error"
    console.error("[email] Failed to send mail:", message)
    return { ok: false, skipped: false, error: message }
  }
}

/** Fire-and-forget helper for form routes: logs failures without failing the request. */
export async function sendMailSafe(
  options: SendMailOptions,
  context: string
): Promise<void> {
  const result = await sendMail(options)

  if (result.ok) {
    console.info(`[email] Sent ${context} (${result.messageId})`)
    return
  }

  if (result.skipped) {
    console.warn(`[email] Skipped ${context}: ${result.reason}`)
    return
  }

  console.error(`[email] Failed ${context}: ${result.error}`)
}
