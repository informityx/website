import { z } from "zod"

export const requiredEmailField = z
  .string()
  .transform((s) => s.trim())
  .pipe(
    z
      .string()
      .min(1, "Email is required")
      .max(254, "Email is too long")
      .email("Enter a valid email address")
  )

export const requiredPhoneField = z
  .string()
  .transform((s) => s.trim())
  .pipe(
    z
      .string()
      .min(1, "Phone number is required")
      .max(40, "Phone number is too long")
      .superRefine((value, ctx) => {
        const digits = value.replace(/\D/g, "")
        if (digits.length < 10 || digits.length > 15) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter a valid phone number (10–15 digits)",
          })
        }
      })
  )
