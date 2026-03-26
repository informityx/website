"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"

interface ModalShellProps {
  children: ReactNode
  onClose: () => void
  /** Max width - default max-w-2xl for form modals, can override for content modals */
  maxWidth?: "max-w-2xl" | "max-w-4xl" | "max-w-5xl"
}

/** IOS-style modal shell: rounded corners, subtle shadow, blurred backdrop, circular close button */
export default function ModalShell({
  children,
  onClose,
  maxWidth = "max-w-2xl",
}: ModalShellProps) {
  const [isMounted, setIsMounted] = useState(false)
  const onCloseRef = useRef(onClose)
  const hasModalHistoryRef = useRef(false)
  const ignoreNextPopStateRef = useRef(false)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    setIsMounted(true)

    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0

    if (isTouchDevice) {
      // Add a temporary history state so mobile back closes modal first.
      window.history.pushState(
        { ...(window.history.state ?? {}), __modalShell: true },
        "",
        window.location.href
      )
      hasModalHistoryRef.current = true
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return

      if (hasModalHistoryRef.current) {
        ignoreNextPopStateRef.current = true
        hasModalHistoryRef.current = false
        window.history.back()
      }
      onCloseRef.current()
    }

    const handlePopState = () => {
      if (!hasModalHistoryRef.current) return
      hasModalHistoryRef.current = false

      if (ignoreNextPopStateRef.current) {
        ignoreNextPopStateRef.current = false
        return
      }

      onCloseRef.current()
    }

    document.addEventListener("keydown", handleEscape)
    window.addEventListener("popstate", handlePopState)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      window.removeEventListener("popstate", handlePopState)
      document.body.style.overflow = "unset"
    }
  }, [])

  if (!isMounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={() => {
        if (hasModalHistoryRef.current) {
          ignoreNextPopStateRef.current = true
          hasModalHistoryRef.current = false
          window.history.back()
        }
        onClose()
      }}
    >
      <div
        className={`bg-white rounded-3xl shadow-2xl w-full ${maxWidth} max-h-[85vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex justify-end p-4 pb-0">
          <button
            type="button"
            onClick={() => {
              if (hasModalHistoryRef.current) {
                ignoreNextPopStateRef.current = true
                hasModalHistoryRef.current = false
                window.history.back()
              }
              onClose()
            }}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 hover:text-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <span className="text-xl font-light leading-none">×</span>
          </button>
        </div>
        <div className="px-6 pb-6 pt-0 -mt-2">{children}</div>
      </div>
    </div>,
    document.body
  )
}
