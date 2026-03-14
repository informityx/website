"use client"

import { useGetInTouchModal } from "./GetInTouchModal"

interface OpenContactModalButtonProps {
  children: React.ReactNode
  className?: string
}

/** Renders children as a clickable element that opens the Get In Touch modal */
export default function OpenContactModalButton({
  children,
  className,
}: OpenContactModalButtonProps) {
  const { openModal } = useGetInTouchModal()

  return (
    <button type="button" onClick={openModal} className={className}>
      {children}
    </button>
  )
}
