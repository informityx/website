import { z } from "zod"

/** Treat null, undefined, and whitespace-only as missing. */
export function emptyToUndefined(val: unknown): unknown {
  if (val === null || val === undefined) return undefined
  if (typeof val === "string" && val.trim() === "") return undefined
  return val
}

/**
 * Get-in-touch payloads: name required; at least one of email or phone (10–15 digits).
 * Project fields optional; validates formats when values are present.
 */
export const getInTouchPayloadSchema = z
  .object({
    fullName: z
      .string()
      .transform((s) => s.trim())
      .pipe(
        z
          .string()
          .min(1, "Full name is required")
          .max(120, "Name must be at most 120 characters")
          .regex(
            /^[\p{L}\p{M}0-9\s'.-]+$/u,
            "Name may only include letters, numbers, spaces, and .-'"
          )
      ),
    email: z.preprocess(
      emptyToUndefined,
      z.string().max(254, "Email is too long").email("Enter a valid email address").optional()
    ),
    phone: z.preprocess(
      emptyToUndefined,
      z.string().max(40, "Phone number is too long").optional()
    ),
    company: z.preprocess(emptyToUndefined, z.string().max(200).optional()),
    inquiryType: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 50)),
    budget: z.preprocess(emptyToUndefined, z.string().max(50).optional().nullable()),
    timeline: z.preprocess(emptyToUndefined, z.string().max(50).optional().nullable()),
    subject: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 200)),
    message: z
      .string()
      .optional()
      .transform((s) => (s ?? "").trim().slice(0, 5000)),
  })
  .superRefine((data, ctx) => {
    const hasEmail = typeof data.email === "string" && data.email.length > 0
    const phoneStr = typeof data.phone === "string" ? data.phone : ""
    const digits = phoneStr.replace(/\D/g, "")
    const phoneValid = digits.length >= 10 && digits.length <= 15
    const phoneTried = phoneStr.length > 0

    if (!hasEmail && !phoneValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter an email address or a contact number (10–15 digits)",
        path: ["email"],
      })
    }

    if (phoneTried && !phoneValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid phone number (10–15 digits)",
        path: ["phone"],
      })
    }
  })

export type GetInTouchPayload = z.infer<typeof getInTouchPayloadSchema>

/** Map Zod issues to { fieldPath: message } for inline form errors. */
export function flattenZodFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key === "string" && out[key] === undefined) {
      out[key] = issue.message
    }
  }
  return out
}
