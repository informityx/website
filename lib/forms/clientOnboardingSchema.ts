import { z } from "zod"
import { requiredEmailField, requiredPhoneField } from "./contactFields"
import { flattenZodFieldErrors } from "./getInTouchSchema"

export const clientOnboardingPayloadSchema = z
  .object({
    companyName: z
      .string()
      .transform((s) => s.trim())
      .pipe(z.string().min(1, "Company name is required").max(200)),
    mainPointOfContact: z
      .string()
      .transform((s) => s.trim())
      .pipe(z.string().min(1, "Main point of contact is required").max(120)),
    email: requiredEmailField,
    phone: requiredPhoneField,
    preferredCommunicationChannel: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 50)),
    companyDescription: z
      .string()
      .transform((s) => s.trim())
      .pipe(z.string().min(1, "Company description is required").max(5000)),
    targetCustomer: z
      .string()
      .transform((s) => s.trim())
      .pipe(z.string().min(1, "Target customer is required").max(5000)),
    businessUnique: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 5000)),
    problemSolving: z
      .string()
      .transform((s) => s.trim())
      .pipe(z.string().min(1, "Problem description is required").max(5000)),
    desiredCoreFeatures: z
      .string()
      .transform((s) => s.trim())
      .pipe(z.string().min(1, "Desired core features are required").max(5000)),
    existingSystem: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 5000)),
    technicalConstraints: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 5000)),
    competitorsAdmire: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 500)),
    logoBrandGuide: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 500)),
    colorPreferences: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 500)),
    toneOfVoice: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 50)),
    paymentGateways: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 500)),
    specificIntegrations: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 500)),
    adminControlExpectations: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 500)),
    gdprRequired: z.boolean().optional().default(false),
    termsPrivacyAvailable: z.boolean().optional().default(false),
    idealLaunchDate: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 50)),
    budgetRange: z
      .string()
      .transform((s) => s.trim())
      .pipe(z.string().min(1, "Budget range is required").max(100)),
    postMvpFeatures: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 5000)),
    longTermGoals: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 5000)),
  })
  .passthrough()

export type ClientOnboardingPayload = z.infer<typeof clientOnboardingPayloadSchema>

export { flattenZodFieldErrors }
