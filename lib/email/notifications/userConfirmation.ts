import { escapeHtml, wrapHtmlLetter } from "../format"
import { sendMailSafe } from "../sendMail"

export type UserThankYouEmailInput = {
  to: string
  recipientName: string
  formLabel: string
}

export async function sendUserThankYouEmail(
  input: UserThankYouEmailInput
): Promise<void> {
  const greeting = input.recipientName.trim() || "there"

  const text = [
    `Hi ${greeting},`,
    "",
    `Thank you for ${input.formLabel}. We have received your submission and will contact you back soon.`,
    "",
    "Best regards,",
    "The InforMityx Team",
  ].join("\n")

  const html = wrapHtmlLetter(
    "Thank you for contacting us",
    `<p style="margin:0 0 12px;">Hi ${escapeHtml(greeting)},</p>
<p style="margin:0 0 12px;">Thank you for ${escapeHtml(input.formLabel)}. We have received your submission and will contact you back soon.</p>
<p style="margin:0;">Best regards,<br>The InforMityx Team</p>`
  )

  await sendMailSafe(
    {
      to: input.to,
      subject: "Thank you — we'll be in touch",
      text,
      html,
    },
    `user thank-you to ${input.to}`
  )
}
