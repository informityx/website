"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import {
  flattenZodFieldErrors,
  getInTouchPayloadSchema,
} from "@/lib/forms/getInTouchSchema"

const selectChevron =
  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000/svg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%2394a3b8%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"

/* !text-* beats globals.css `input,select { color: #000 !important }` on .public-site */
const inputBase =
  "w-full px-4 py-2.5 rounded-xl border bg-slate-950/50 !text-white placeholder:!text-white/75 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition scheme-dark " +
  "[&:-webkit-autofill]:!text-white [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgb(15_23_42_/_0.85)] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"

const inputOk = `${inputBase} border-white/15`
const inputErr = `${inputBase} border-red-400/70 focus:ring-red-400/50 focus:border-red-400/70`

const labelClass = "block text-sm font-medium !text-white mb-1"

const inquiryLabels: Record<string, string> = {
  general: "General Inquiry",
  web: "Web Development",
  mobile: "Mobile App",
  consulting: "Consulting",
  other: "Other",
}

function fieldHint(id: string, text: string) {
  return (
    <p id={id} className="mt-1 text-xs text-slate-400">
      {text}
    </p>
  )
}

export default function CTAInlineProjectForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setFieldErrors({})
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    const raw = {
      fullName: formData.get("fullName")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      phone: formData.get("phone")?.toString() ?? "",
      inquiryType: formData.get("inquiryType")?.toString() ?? "",
      budget: formData.get("budget")?.toString() || null,
      timeline: null,
      subject: "",
      message: formData.get("message")?.toString() ?? "",
    }

    const parsed = getInTouchPayloadSchema.safeParse(raw)
    if (!parsed.success) {
      setFieldErrors(flattenZodFieldErrors(parsed.error))
      setIsSubmitting(false)
      return
    }

    const typeLabel =
      inquiryLabels[parsed.data.inquiryType] ||
      (parsed.data.inquiryType ? parsed.data.inquiryType : "Not specified")
    const subject = `Website CTA — Start your project (${typeLabel})`

    const data = {
      ...parsed.data,
      subject,
    }

    try {
      const res = await fetch("/api/forms/get-in-touch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? "Failed to submit")
      }
      toast.success("Thanks! We'll be in touch soon.")
      form.reset()
      setFieldErrors({})
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inClass = (name: string) => (fieldErrors[name] ? inputErr : inputOk)

  return (
    <div className="text-left">
      <h3 className="text-xl font-semibold text-white mb-4">
        Start Your Project
      </h3>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        aria-busy={isSubmitting}
        noValidate
      >
        <div>
          <label htmlFor="cta-fullName" className={labelClass}>
            Full Name <span className="text-brand-primary">*</span>
          </label>
          <input
            id="cta-fullName"
            type="text"
            name="fullName"
            required
            autoComplete="name"
            placeholder="Your name"
            maxLength={120}
            className={inClass("fullName")}
            aria-invalid={!!fieldErrors.fullName}
            aria-describedby={fieldErrors.fullName ? "cta-fullName-err" : undefined}
          />
          {fieldErrors.fullName && (
            <p id="cta-fullName-err" className="mt-1 text-sm text-red-300" role="alert">
              {fieldErrors.fullName}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cta-email" className={labelClass}>
              Email
            </label>
            <input
              id="cta-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@company.com"
              maxLength={254}
              className={inClass("email")}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={
                fieldErrors.email ? "cta-email-err" : "cta-email-hint"
              }
            />
            {fieldErrors.email ? (
              <p id="cta-email-err" className="mt-1 text-sm text-red-300" role="alert">
                {fieldErrors.email}
              </p>
            ) : (
              fieldHint("cta-email-hint", "Required unless you add a contact number below.")
            )}
          </div>
          <div>
            <label htmlFor="cta-phone" className={labelClass}>
              Contact number
            </label>
            <input
              id="cta-phone"
              type="tel"
              name="phone"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+1 555 123 4567"
              maxLength={40}
              className={inClass("phone")}
              aria-invalid={!!fieldErrors.phone}
              aria-describedby={
                fieldErrors.phone ? "cta-phone-err" : "cta-phone-hint"
              }
            />
            {fieldErrors.phone ? (
              <p id="cta-phone-err" className="mt-1 text-sm text-red-300" role="alert">
                {fieldErrors.phone}
              </p>
            ) : (
              fieldHint("cta-phone-hint", "10–15 digits if used; required if no email.")
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cta-inquiryType" className={labelClass}>
              Project Type
            </label>
            <select
              id="cta-inquiryType"
              name="inquiryType"
              className={`${inClass("inquiryType")} appearance-none ${selectChevron}`}
              aria-invalid={!!fieldErrors.inquiryType}
            >
              <option value="" className="bg-slate-950 text-white">
                Select type (optional)
              </option>
              <option value="general" className="bg-slate-950 text-white">
                General Inquiry
              </option>
              <option value="web" className="bg-slate-950 text-white">
                Web Development
              </option>
              <option value="mobile" className="bg-slate-950 text-white">
                Mobile App
              </option>
              <option value="consulting" className="bg-slate-950 text-white">
                Consulting
              </option>
              <option value="other" className="bg-slate-950 text-white">
                Other
              </option>
            </select>
            {fieldErrors.inquiryType && (
              <p className="mt-1 text-sm text-red-300" role="alert">
                {fieldErrors.inquiryType}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="cta-budget" className={labelClass}>
              Budget Range
            </label>
            <select
              id="cta-budget"
              name="budget"
              className={`${inClass("budget")} appearance-none ${selectChevron}`}
            >
              <option value="" className="bg-slate-950 text-white">
                Select budget
              </option>
              <option value="5k" className="bg-slate-950 text-white">
                Under $5,000
              </option>
              <option value="5k-15k" className="bg-slate-950 text-white">
                $5,000 - $15,000
              </option>
              <option value="15k-30k" className="bg-slate-950 text-white">
                $15,000 - $30,000
              </option>
              <option value="30k+" className="bg-slate-950 text-white">
                $30,000+
              </option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="cta-message" className={labelClass}>
            Short Message
          </label>
          <textarea
            id="cta-message"
            name="message"
            rows={4}
            maxLength={5000}
            placeholder="Tell us about your idea or goals (optional)"
            className={`${inClass("message")} resize-y min-h-[100px]`}
            aria-invalid={!!fieldErrors.message}
            aria-describedby={fieldErrors.message ? "cta-message-err" : undefined}
          />
          {fieldErrors.message && (
            <p id="cta-message-err" className="mt-1 text-sm text-red-300" role="alert">
              {fieldErrors.message}
            </p>
          )}
        </div>

        {error && (
          <div
            className="rounded-xl bg-red-950/60 border border-red-500/30 text-red-200 px-4 py-3 text-sm"
            role="alert"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending…" : "Get Started"}
        </button>
      </form>
    </div>
  )
}
