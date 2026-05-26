import { z } from "zod"
import { requiredEmailField, requiredPhoneField } from "./contactFields"

/** Treat null, undefined, and whitespace-only as missing. */
export function emptyToUndefined(val: unknown): unknown {
  if (val === null || val === undefined) return undefined
  if (typeof val === "string" && val.trim() === "") return undefined
  return val
}

/**
 * Get-in-touch payloads: name, email, and phone are all required.
 * Project fields optional; validates formats when values are present.
 */
export const getInTouchPayloadSchema = z.object({
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
  email: requiredEmailField,
  phone: requiredPhoneField,
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
