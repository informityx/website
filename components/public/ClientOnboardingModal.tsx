"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import toast from "react-hot-toast"
import ModalShell from "./ui/ModalShell"

const IconBuilding = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
  </svg>
)
const IconUsers = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IconFile = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
  </svg>
)
const IconPalette = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="13.5" cy="6.5" r=".5" />
    <circle cx="17.5" cy="10.5" r=".5" />
    <circle cx="8.5" cy="7.5" r=".5" />
    <circle cx="6.5" cy="12.5" r=".5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
  </svg>
)
const IconSettings = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const IconShield = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const IconCalendar = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const IconTarget = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const selectClass =
  "w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"
const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition"
const textareaClass =
  "w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition resize-y"
const labelClass = "block text-sm font-medium text-gray-700 mb-1"
const sectionClass = "mb-6"
const sectionHeaderClass = "flex items-center gap-2 mb-4"
const sectionTitleClass = "font-semibold text-gray-900"

type ClientOnboardingContextType = {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const ClientOnboardingContext = createContext<ClientOnboardingContextType | null>(null)

export function useClientOnboardingModal() {
  const ctx = useContext(ClientOnboardingContext)
  if (!ctx) throw new Error("useClientOnboardingModal must be used within ClientOnboardingModalProvider")
  return ctx
}

export function ClientOnboardingModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ClientOnboardingContext.Provider
      value={{
        isOpen,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
      }}
    >
      {children}
      {isOpen && (
        <ClientOnboardingModalContent onClose={() => setIsOpen(false)} />
      )}
    </ClientOnboardingContext.Provider>
  )
}

function ClientOnboardingModalContent({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    const data: Record<string, unknown> = {
      // Step 1: Company Info
      companyName: formData.get("companyName")?.toString() ?? "",
      mainPointOfContact: formData.get("mainPointOfContact")?.toString() ?? "",
      preferredCommunicationChannel: formData.get("preferredCommunicationChannel")?.toString() ?? "",
      contactInfo: formData.get("contactInfo")?.toString() ?? "",
      // Step 2: About Your Business
      companyDescription: formData.get("companyDescription")?.toString() ?? "",
      targetCustomer: formData.get("targetCustomer")?.toString() ?? "",
      businessUnique: formData.get("businessUnique")?.toString() ?? "",
      // Step 3: Project Details
      problemSolving: formData.get("problemSolving")?.toString() ?? "",
      desiredCoreFeatures: formData.get("desiredCoreFeatures")?.toString() ?? "",
      existingSystem: formData.get("existingSystem")?.toString() ?? "",
      technicalConstraints: formData.get("technicalConstraints")?.toString() ?? "",
      competitorsAdmire: formData.get("competitorsAdmire")?.toString() ?? "",
      // Step 4: Design & Branding
      logoBrandGuide: formData.get("logoBrandGuide")?.toString() ?? "",
      colorPreferences: formData.get("colorPreferences")?.toString() ?? "",
      toneOfVoice: formData.get("toneOfVoice")?.toString() ?? "",
      // Step 5: Functional Requirements
      paymentGateways: formData.get("paymentGateways")?.toString() ?? "",
      specificIntegrations: formData.get("specificIntegrations")?.toString() ?? "",
      adminControlExpectations: formData.get("adminControlExpectations")?.toString() ?? "",
      gdprRequired: formData.get("gdprRequired") === "on",
      termsPrivacyAvailable: formData.get("termsPrivacyAvailable") === "on",
      // Step 6: Timeline & Budget
      idealLaunchDate: formData.get("idealLaunchDate")?.toString() ?? "",
      budgetRange: formData.get("budgetRange")?.toString() ?? "",
      postMvpFeatures: formData.get("postMvpFeatures")?.toString() ?? "",
      longTermGoals: formData.get("longTermGoals")?.toString() ?? "",
    }

    try {
      const res = await fetch("/api/forms/client-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? "Failed to submit")
      }
      toast.success("Questionnaire submitted successfully! Thank you.")
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <IconFile className="h-5 w-5 text-brand-primary shrink-0" />
        <h2 className="text-2xl font-bold text-gray-900">Client Onboarding Questionnaire</h2>
      </div>
      <p className="text-gray-500 text-sm mb-6">Fill this out during your client discovery call</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Company Info */}
        <div className={sectionClass}>
          <div className={sectionHeaderClass}>
            <IconBuilding className="h-4 w-4 text-brand-primary shrink-0" />
            <h3 className={sectionTitleClass}>Company Info</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Company Name <span className="text-brand-primary">*</span></label>
              <input type="text" name="companyName" required placeholder="Enter company name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Main Point of Contact <span className="text-brand-primary">*</span></label>
              <input type="text" name="mainPointOfContact" required placeholder="Contact person name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Preferred Communication Channel</label>
              <select name="preferredCommunicationChannel" className={selectClass}>
                <option value="">Select channel</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="slack">Slack</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Contact Info</label>
              <input type="text" name="contactInfo" placeholder="Email, phone, etc." className={inputClass} />
            </div>
          </div>
        </div>

        {/* Step 2: About Your Business */}
        <div className={sectionClass}>
          <div className={sectionHeaderClass}>
            <IconUsers className="h-4 w-4 text-brand-primary shrink-0" />
            <h3 className={sectionTitleClass}>About Your Business</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>What does your company do? <span className="text-brand-primary">*</span></label>
              <textarea name="companyDescription" required rows={3} placeholder="Describe your business..." className={textareaClass} />
            </div>
            <div>
              <label className={labelClass}>Who is your target customer? <span className="text-brand-primary">*</span></label>
              <textarea name="targetCustomer" required rows={3} placeholder="Describe your target audience..." className={textareaClass} />
            </div>
            <div>
              <label className={labelClass}>What makes your business unique?</label>
              <textarea name="businessUnique" rows={3} placeholder="Your unique value proposition..." className={textareaClass} />
            </div>
          </div>
        </div>

        {/* Step 3: Project Details */}
        <div className={sectionClass}>
          <div className={sectionHeaderClass}>
            <IconFile className="h-4 w-4 text-brand-primary shrink-0" />
            <h3 className={sectionTitleClass}>Project Details</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>What problem are we solving? <span className="text-brand-primary">*</span></label>
              <textarea name="problemSolving" required rows={3} placeholder="Describe the main problem..." className={textareaClass} />
            </div>
            <div>
              <label className={labelClass}>Desired core features? <span className="text-brand-primary">*</span></label>
              <textarea name="desiredCoreFeatures" required rows={3} placeholder="List key features needed...." className={textareaClass} />
            </div>
            <div>
              <label className={labelClass}>Any existing system or website?</label>
              <textarea name="existingSystem" rows={2} placeholder="Current systems in use..." className={textareaClass} />
            </div>
            <div>
              <label className={labelClass}>Technical constraints (if any)?</label>
              <textarea name="technicalConstraints" rows={2} placeholder="Any technical limitations...." className={textareaClass} />
            </div>
            <div>
              <label className={labelClass}>Competitors you admire?</label>
              <input type="text" name="competitorsAdmire" placeholder="Company names or websites..." className={inputClass} />
            </div>
          </div>
        </div>

        {/* Step 4: Design & Branding */}
        <div className={sectionClass}>
          <div className={sectionHeaderClass}>
            <IconPalette className="h-4 w-4 text-brand-primary shrink-0" />
            <h3 className={sectionTitleClass}>Design & Branding</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Do you have a logo & brand guide?</label>
              <input type="text" name="logoBrandGuide" placeholder="Yes/No or provide details" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Color preferences?</label>
              <input type="text" name="colorPreferences" placeholder="Preferred colors or hex codes" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Tone of voice</label>
              <div className="flex flex-wrap gap-4 pt-2">
                {["Playful", "Corporate", "Minimal", "Bold"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="toneOfVoice" value={opt.toLowerCase()} className="text-brand-primary" />
                    <span className="text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 5: Functional Requirements + Legal */}
        <div className={sectionClass}>
          <div className={sectionHeaderClass}>
            <IconSettings className="h-4 w-4 text-brand-primary shrink-0" />
            <h3 className={sectionTitleClass}>Functional Requirements</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Preferred payment gateways?</label>
              <input type="text" name="paymentGateways" placeholder="Stripe, PayPal, Razorpay, etc." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Any specific integrations?</label>
              <input type="text" name="specificIntegrations" placeholder="CRM, Email tools, Analytics, etc." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Admin control expectations?</label>
              <input type="text" name="adminControlExpectations" placeholder="Describe expectations..." className={inputClass} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className={sectionHeaderClass}>
              <IconShield className="h-4 w-4 text-brand-primary shrink-0" />
              <h3 className={sectionTitleClass}>Legal & Compliance</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="gdprRequired" className="rounded text-brand-primary" />
                <span className="text-gray-700">GDPR compliance required?</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="termsPrivacyAvailable" className="rounded text-brand-primary" />
                <span className="text-gray-700">Terms & Privacy links available?</span>
              </label>
            </div>
          </div>
        </div>

        {/* Step 6: Timeline & Budget + Future Vision */}
        <div className={sectionClass}>
          <div className={sectionHeaderClass}>
            <IconCalendar className="h-4 w-4 text-brand-primary shrink-0" />
            <h3 className={sectionTitleClass}>Timeline & Budget</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Ideal launch date?</label>
              <input type="text" name="idealLaunchDate" placeholder="dd/mm/yyyy" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Budget range? <span className="text-brand-primary">*</span></label>
              <input type="text" name="budgetRange" required placeholder="$5k-10k, $10k-25k, etc." className={inputClass} />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className={sectionHeaderClass}>
              <IconTarget className="h-4 w-4 text-brand-primary shrink-0" />
              <h3 className={sectionTitleClass}>Future Vision</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Post-MVP features planned?</label>
                <textarea name="postMvpFeatures" rows={3} placeholder="Features for future releases..." className={textareaClass} />
              </div>
              <div>
                <label className={labelClass}>Long-term product goals?</label>
                <textarea name="longTermGoals" rows={3} placeholder="Vision for the product in 2-3 years...." className={textareaClass} />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Questionnaire"}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}
