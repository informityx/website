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
        {service.content && (
          <div className="prose max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(service.content),
              }}
            />
          </div>
        )}
      </div>
    </ModalShell>
  )
}
