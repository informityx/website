"use client"

import { ServiceData } from "@/types/cms"
import Image from "next/image"
import ModalShell from "@/components/public/ui/ModalShell"

interface ServiceModalProps {
  service: ServiceData
  onClose: () => void
}

export default function ServiceModal({ service, onClose }: ServiceModalProps) {
  return (
    <ModalShell onClose={onClose} maxWidth="max-w-4xl">
      <div className="pt-2">
        {service.image && (
          <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <h2 className="text-2xl font-bold text-brand-header mb-4">{service.title}</h2>
        {service.description && (
          <div className="prose max-w-none mb-4">
            <p className="text-lg text-gray-700 whitespace-pre-line">
              {service.description}
            </p>
          </div>
        )}
        {service.content && typeof service.content === "string" ? (
          <div className="prose max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: service.content,
              }}
            />
          </div>
        ) : null}
        {service.content && typeof service.content !== "string" ? (
          <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-x-auto">
            {JSON.stringify(service.content, null, 2)}
          </pre>
        ) : null}
      </div>
    </ModalShell>
  )
}
