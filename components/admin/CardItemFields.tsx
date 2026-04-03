"use client"

import type { CardItem, CardServiceItem } from "@/types/cms"
import ImagePicker from "./ImagePicker"
import RichTextEditor from "./RichTextEditor"
import { slugify } from "@/lib/slugify"

const defaultInputClass =
  "w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

function getCardServices(card: CardItem): CardServiceItem[] {
  if (card.services && card.services.length > 0) return card.services
  const legacy = (card as { technologies?: string[] }).technologies
  if (Array.isArray(legacy) && legacy.length > 0) {
    return legacy.map((t) => ({ title: t, description: "" }))
  }
  return []
}

export interface CardItemFieldsProps {
  value: CardItem
  onChange: (card: CardItem) => void
  index: number
  /** Base path for card URL hint, e.g. `blog` → `/blog/slug` */
  pathSlugHint?: string
  inputClass?: string
  /** When set, shows a Remove control for this card (e.g. in section editor lists). */
  onRemove?: () => void
}

export default function CardItemFields({
  value: card,
  onChange,
  index,
  pathSlugHint,
  inputClass = defaultInputClass,
  onRemove,
}: CardItemFieldsProps) {
  const base = pathSlugHint?.trim() ? `/${pathSlugHint.trim()}` : "/…"

  const setCard = (next: CardItem) => {
    onChange(next)
  }

  return (
    <div className="border border-gray-800 rounded-lg p-4 bg-gray-50 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Card {index + 1}</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-lg text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        )}
      </div>
      <div>
        <ImagePicker
          value={card.image || ""}
          onChange={(url) => setCard({ ...card, image: url })}
          label="Image"
          prefix="media"
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-600">Heading</label>
        <input
          type="text"
          value={card.heading || ""}
          onChange={(e) => setCard({ ...card, heading: e.target.value })}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-600">Description</label>
        <textarea
          value={card.description || ""}
          onChange={(e) => setCard({ ...card, description: e.target.value })}
          className={inputClass}
          rows={2}
        />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-600">Overview (modal)</label>
        <textarea
          value={card.overview || ""}
          onChange={(e) => setCard({ ...card, overview: e.target.value })}
          className={inputClass}
          rows={2}
        />
      </div>
      <div>
        <RichTextEditor
          label="Detailed content (full page only)"
          value={card.detailHtml || ""}
          onChange={(html) => setCard({ ...card, detailHtml: html })}
        />
        <p className="text-xs text-gray-500 mt-1">
          Shown only on the card detail URL. If the cards block is on a custom type page, a
          &quot;Read more&quot; link appears in the modal when this has content.
        </p>
      </div>
      <div>
        <label className="block text-xs font-medium mb-1 text-gray-600">Open card in</label>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name={`card-open-${index}`}
              checked={card.openInModal !== false}
              onChange={() => {
                const { cardSlug: _, ...rest } = card
                setCard({ ...rest, openInModal: true })
              }}
            />
            <span className="text-sm">Modal</span>
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name={`card-open-${index}`}
              checked={card.openInModal === false}
              onChange={() => {
                const slug =
                  card.cardSlug ||
                  slugify(card.heading || "") ||
                  `card-${index + 1}`
                setCard({
                  ...card,
                  openInModal: false,
                  cardSlug: slug,
                })
              }}
            />
            <span className="text-sm">New page</span>
          </label>
        </div>
        {card.openInModal === false && (
          <div className="mt-2">
            <label className="block text-xs font-medium mb-1 text-gray-600">Card URL slug</label>
            <input
              type="text"
              value={card.cardSlug || ""}
              onChange={(e) =>
                setCard({
                  ...card,
                  cardSlug:
                    e.target.value.trim() ||
                    slugify(card.heading || "") ||
                    `card-${index + 1}`,
                })
              }
              placeholder={slugify(card.heading || "") || `card-${index + 1}`}
              className={inputClass}
            />
            <p className="text-xs text-gray-500 mt-0.5">
              URL will be {base}/{card.cardSlug || "…"}
            </p>
          </div>
        )}
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-xs font-medium text-gray-600">
            Services (title + short description)
          </label>
          <button
            type="button"
            onClick={() => {
              const svcs = [...getCardServices(card)]
              svcs.push({ title: "", description: "" })
              const { technologies, keyFeatures, ...rest } = card as CardItem & {
                technologies?: string[]
                keyFeatures?: string[]
              }
              setCard({ ...rest, services: svcs })
            }}
            className="text-lg bg-gray-800 text-gray-100 px-2 py-1 rounded hover:bg-gray-300"
          >
            Add service
          </button>
        </div>
        <div className="space-y-2">
          {getCardServices(card).map((svc, svcIdx) => (
            <div
              key={svcIdx}
              className="flex gap-2 items-start p-2 bg-white rounded border border-gray-200"
            >
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  placeholder="Title"
                  value={svc.title}
                  onChange={(e) => {
                    const svcs = [...getCardServices(card)]
                    svcs[svcIdx] = { ...svcs[svcIdx], title: e.target.value }
                    const { technologies, keyFeatures, ...rest } = card as CardItem & {
                      technologies?: string[]
                      keyFeatures?: string[]
                    }
                    setCard({ ...rest, services: svcs })
                  }}
                  className={inputClass}
                />
                <textarea
                  placeholder="Short description"
                  value={svc.description}
                  onChange={(e) => {
                    const svcs = [...getCardServices(card)]
                    svcs[svcIdx] = { ...svcs[svcIdx], description: e.target.value }
                    const { technologies, keyFeatures, ...rest } = card as CardItem & {
                      technologies?: string[]
                      keyFeatures?: string[]
                    }
                    setCard({ ...rest, services: svcs })
                  }}
                  className={inputClass}
                  rows={2}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const svcs = getCardServices(card).filter((_, i) => i !== svcIdx)
                  const { technologies, keyFeatures, ...rest } = card as CardItem & {
                    technologies?: string[]
                    keyFeatures?: string[]
                  }
                  setCard({ ...rest, services: svcs })
                }}
                className="text-lg text-red-600 hover:text-red-800 mt-1"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">Live demo URL</label>
          <input
            type="url"
            value={card.liveDemoUrl || ""}
            onChange={(e) => setCard({ ...card, liveDemoUrl: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-600">Source code URL</label>
          <input
            type="url"
            value={card.sourceCodeUrl || ""}
            onChange={(e) => setCard({ ...card, sourceCodeUrl: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  )
}
