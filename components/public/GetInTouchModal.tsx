"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import ModalShell from "./ui/ModalShell"

const IconEnvelope = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <path d="m22 6-10 7L2 6" />
  </svg>
)
const IconUser = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const IconFolder = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)
const IconMessage = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)
type GetInTouchContextType = {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const GetInTouchContext = createContext<GetInTouchContextType | null>(null)

export function useGetInTouchModal() {
  const ctx = useContext(GetInTouchContext)
  if (!ctx) throw new Error("useGetInTouchModal must be used within GetInTouchModalProvider")
  return ctx
}

export function GetInTouchModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <GetInTouchContext.Provider
      value={{
        isOpen,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
      }}
    >
      {children}
      {isOpen && (
        <GetInTouchModalContent onClose={() => setIsOpen(false)} />
      )}
    </GetInTouchContext.Provider>
  )
}

function GetInTouchModalContent({ onClose }: { onClose: () => void }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: wire to API
    onClose()
  }

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <IconEnvelope className="h-5 w-5 text-brand-primary shrink-0" />
        <h2 className="text-2xl font-bold text-gray-900">Get In Touch</h2>
      </div>
      <p className="text-gray-500 text-sm mb-6">Let&apos;s discuss your project</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <IconUser className="h-4 w-4 text-brand-primary shrink-0" />
            <h3 className="font-semibold text-gray-900">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-brand-primary">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Your full name"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-brand-primary">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="your.email@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company/Organization
              </label>
              <input
                type="text"
                name="company"
                placeholder="Your company name"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Project Information */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <IconFolder className="h-4 w-4 text-brand-primary shrink-0" />
            <h3 className="font-semibold text-gray-900">Project Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inquiry Type <span className="text-brand-primary">*</span>
              </label>
              <select
                name="inquiryType"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"
              >
                <option value="">Select inquiry type</option>
                <option value="general">General Inquiry</option>
                <option value="web">Web Development</option>
                <option value="mobile">Mobile App</option>
                <option value="consulting">Consulting</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Range
              </label>
              <select
                name="budget"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"
              >
                <option value="">Select budget range</option>
                <option value="5k">Under $5,000</option>
                <option value="5k-15k">$5,000 - $15,000</option>
                <option value="15k-30k">$15,000 - $30,000</option>
                <option value="30k+">$30,000+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Timeline
              </label>
              <select
                name="timeline"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%236b7280%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"
              >
                <option value="">Select timeline</option>
                <option value="asap">ASAP</option>
                <option value="1-3">1-3 months</option>
                <option value="3-6">3-6 months</option>
                <option value="6+">6+ months</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject <span className="text-brand-primary">*</span>
              </label>
              <input
                type="text"
                name="subject"
                required
                placeholder="Brief subject of your inquiry"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <IconMessage className="h-4 w-4 text-brand-primary shrink-0" />
            <h3 className="font-semibold text-gray-900">Project Details</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-brand-primary">*</span>
            </label>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Please describe your project, goals, requirements, or any specific questions you have. The more details you provide, the better I can assist you."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition resize-y"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border-2 border-brand-primary text-brand-primary font-medium hover:bg-brand-primary/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-hover transition-colors"
          >
            <IconEnvelope className="h-5 w-5 shrink-0" />
            Send Message
          </button>
        </div>
      </form>
    </ModalShell>
  )
}
