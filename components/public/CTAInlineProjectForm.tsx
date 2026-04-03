"use client"

import { useState } from "react"
import toast from "react-hot-toast"

const selectChevron =
  "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%2394a3b8%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"

/* !text-* beats globals.css `input,select { color: #000 !important }` on .public-site */
const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-white/15 bg-slate-950/50 !text-white placeholder:!text-white/75 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition scheme-dark " +
  "[&:-webkit-autofill]:!text-white [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgb(15_23_42_/_0.85)] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"

const labelClass = "block text-sm font-medium !text-white mb-1"

const inquiryLabels: Record<string, string> = {
  general: "General Inquiry",
  web: "Web Development",
  mobile: "Mobile App",
  consulting: "Consulting",
  other: "Other",
}

export default function CTAInlineProjectForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const fullName = formData.get("fullName")?.toString() ?? ""
    const email = formData.get("email")?.toString() ?? ""
    const inquiryType = formData.get("inquiryType")?.toString() ?? ""
    const budget = formData.get("budget")?.toString() || null
    const message = formData.get("message")?.toString() ?? ""

    const typeLabel = inquiryLabels[inquiryType] ?? inquiryType
    const subject = `Website CTA — Start your project (${typeLabel})`

    const data = {
      fullName,
      email,
      phone: null,
      company: null,
      inquiryType,
      budget,
      timeline: null,
      subject,
      message,
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
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      setError(msg)
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="text-left">
      <h3 className="text-xl font-semibold text-white mb-4">
        Start Your Project
      </h3>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        aria-busy={isSubmitting}
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
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="cta-email" className={labelClass}>
            Email <span className="text-brand-primary">*</span>
          </label>
          <input
            id="cta-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cta-inquiryType" className={labelClass}>
              Project Type <span className="text-brand-primary">*</span>
            </label>
            <select
              id="cta-inquiryType"
              name="inquiryType"
              required
              className={`${inputClass} appearance-none ${selectChevron}`}
            >
              <option value="" className="bg-slate-950 text-white">
                Select type
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
          </div>
          <div>
            <label htmlFor="cta-budget" className={labelClass}>
              Budget Range
            </label>
            <select
              id="cta-budget"
              name="budget"
              className={`${inputClass} appearance-none ${selectChevron}`}
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
            Short Message <span className="text-brand-primary">*</span>
          </label>
          <textarea
            id="cta-message"
            name="message"
            required
            rows={4}
            placeholder="Tell us about your idea or goals"
            className={`${inputClass} resize-y min-h-[100px]`}
          />
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
