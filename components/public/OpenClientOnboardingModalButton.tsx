"use client"

import { useClientOnboardingModal } from "./ClientOnboardingModal"

interface OpenClientOnboardingModalButtonProps {
  children: React.ReactNode
  className?: string
}

/** Renders children as a clickable element that opens the Client Onboarding Questionnaire modal */
export default function OpenClientOnboardingModalButton({
  children,
  className,
}: OpenClientOnboardingModalButtonProps) {
  const { openModal } = useClientOnboardingModal()

  return (
    <button type="button" onClick={openModal} className={className}>
      {children}
    </button>
  )
}
