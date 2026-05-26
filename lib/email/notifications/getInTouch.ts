import type { GetInTouchPayload } from "@/lib/forms/getInTouchSchema"
import { formatField, formatFieldHtml, wrapHtmlEmail } from "../format"
import { sendMailSafe } from "../sendMail"
import { sendUserThankYouEmail } from "./userConfirmation"

export type GetInTouchNotificationInput = GetInTouchPayload & {
  submissionId: string
  subject: string
}

export async function notifyGetInTouchSubmission(
  input: GetInTouchNotificationInput
): Promise<void> {
  const rows = [
    formatField("Submission ID", input.submissionId),
    formatField("Full name", input.fullName),
    formatField("Email", input.email),
    formatField("Phone", input.phone),
    formatField("Company", input.company ?? null),
    formatField("Inquiry type", input.inquiryType || "—"),
    formatField("Budget", input.budget ?? null),
    formatField("Timeline", input.timeline ?? null),
    formatField("Subject", input.subject),
    formatField("Message", input.message || "—"),
  ]

  const htmlRows = [
    formatFieldHtml("Submission ID", input.submissionId),
    formatFieldHtml("Full name", input.fullName),
    formatFieldHtml("Email", input.email),
    formatFieldHtml("Phone", input.phone),
    formatFieldHtml("Company", input.company ?? null),
    formatFieldHtml("Inquiry type", input.inquiryType || "—"),
    formatFieldHtml("Budget", input.budget ?? null),
    formatFieldHtml("Timeline", input.timeline ?? null),
    formatFieldHtml("Subject", input.subject),
    formatFieldHtml("Message", input.message || "—"),
  ].join("")

  await sendMailSafe(
    {
      subject: `[Get in touch] ${input.subject}`,
      text: rows.join("\n"),
      html: wrapHtmlEmail("New Get in Touch submission", htmlRows),
      replyTo: input.email,
    },
    `get-in-touch submission ${input.submissionId}`
  )

  if (input.email) {
    await sendUserThankYouEmail({
      to: input.email,
      recipientName: input.fullName,
      formLabel: "reaching out to InforMityx",
    })
  }
}
