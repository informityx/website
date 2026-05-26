import { formatFieldHtml, formatRecordFields, wrapHtmlEmail } from "../format"
import { sendMailSafe } from "../sendMail"
import { sendUserThankYouEmail } from "./userConfirmation"

const CLIENT_ONBOARDING_LABELS: Record<string, string> = {
  companyName: "Company name",
  mainPointOfContact: "Main point of contact",
  email: "Email",
  phone: "Phone",
  preferredCommunicationChannel: "Preferred communication channel",
  companyDescription: "Company description",
  targetCustomer: "Target customer",
  businessUnique: "What makes the business unique",
  problemSolving: "Problem being solved",
  desiredCoreFeatures: "Desired core features",
  existingSystem: "Existing system",
  technicalConstraints: "Technical constraints",
  competitorsAdmire: "Competitors admired",
  logoBrandGuide: "Logo / brand guide",
  colorPreferences: "Color preferences",
  toneOfVoice: "Tone of voice",
  paymentGateways: "Payment gateways",
  specificIntegrations: "Specific integrations",
  adminControlExpectations: "Admin control expectations",
  gdprRequired: "GDPR required",
  termsPrivacyAvailable: "Terms / privacy available",
  idealLaunchDate: "Ideal launch date",
  budgetRange: "Budget range",
  postMvpFeatures: "Post-MVP features",
  longTermGoals: "Long-term goals",
}

export type ClientOnboardingNotificationInput = {
  submissionId: string
  data: Record<string, unknown>
}

export async function notifyClientOnboardingSubmission(
  input: ClientOnboardingNotificationInput
): Promise<void> {
  const companyName =
    typeof input.data.companyName === "string" ? input.data.companyName.trim() : ""
  const email = typeof input.data.email === "string" ? input.data.email.trim() : ""
  const mainPointOfContact =
    typeof input.data.mainPointOfContact === "string"
      ? input.data.mainPointOfContact.trim()
      : ""

  const subjectCompany = companyName || "Unknown company"
  const { text, htmlRows } = formatRecordFields(input.data, CLIENT_ONBOARDING_LABELS)

  const bodyText = [
    `Submission ID: ${input.submissionId}`,
    `Main point of contact: ${mainPointOfContact || "—"}`,
    "",
    text,
  ].join("\n")

  await sendMailSafe(
    {
      subject: `[Client onboarding] ${subjectCompany}`,
      text: bodyText,
      html: wrapHtmlEmail(
        "New Client Onboarding submission",
        [formatFieldHtml("Submission ID", input.submissionId), htmlRows].join("")
      ),
      replyTo: email || undefined,
    },
    `client-onboarding submission ${input.submissionId}`
  )

  if (email) {
    await sendUserThankYouEmail({
      to: email,
      recipientName: mainPointOfContact || companyName,
      formLabel: "completing the InforMityx client onboarding questionnaire",
    })
  }
}
