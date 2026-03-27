"use client"

import { useState, useEffect } from "react"
import { SectionData, CardItem, CardServiceItem } from "@/types/cms"
import ImagePicker from "./ImagePicker"
import { slugify } from "@/lib/slugify"
import type { LifeCyclePhase, LifeCyclePhaseItem } from "@/components/public/sections/ProjectLifeCycleSection"

interface SectionEditorProps {
  section: SectionData
  onUpdate: (section: SectionData) => void
  onDelete: (sectionId: string) => void
}

interface CustomTypeOption {
  id: string
  name: string
  slug: string
}

export default function SectionEditor({
  section,
  onUpdate,
  onDelete,
}: SectionEditorProps) {
  const [content, setContent] = useState(section.content)
  const [isVisible, setIsVisible] = useState(section.isVisible)
  const [order, setOrder] = useState(section.order)
  const [saving, setSaving] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [customTypeOptions, setCustomTypeOptions] = useState<CustomTypeOption[]>([])

  useEffect(() => {
    setContent(section.content)
    setIsVisible(section.isVisible)
    setOrder(section.order)
  }, [section])

  useEffect(() => {
    if (section.type !== "customPostType") return

    const loadCustomTypes = async () => {
      try {
        const response = await fetch("/api/custom-types")
        if (!response.ok) throw new Error("Failed to load custom types")
        const data = await response.json()
        const items = Array.isArray(data)
          ? data.map((item) => ({
              id: String(item.id),
              name: String(item.name),
              slug: String(item.slug),
            }))
          : []
        setCustomTypeOptions(items)
      } catch (error) {
        console.error("Error loading custom types:", error)
      }
    }

    loadCustomTypes()
  }, [section.type])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/sections/${section.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          isVisible,
          order,
        }),
      })

      if (!response.ok) throw new Error("Failed to update section")

      const updated = await response.json()
      onUpdate(updated)
    } catch (error) {
      console.error("Error updating section:", error)
      alert("Failed to update section")
    } finally {
      setSaving(false)
    }
  }

  const renderEditor = () => {
    switch (section.type) {
      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Eyebrow</label>
              <input
                type="text"
                value={(content as any).eyebrow || ""}
                onChange={(e) =>
                  setContent({ ...content, eyebrow: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Optional small label above headline"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Headline</label>
              <input
                type="text"
                value={(content as any).headline || ""}
                onChange={(e) =>
                  setContent({ ...content, headline: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Build Intelligent Digital Products That Scale"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Subheadline</label>
              <textarea
                value={(content as any).subheadline || ""}
                onChange={(e) =>
                  setContent({ ...content, subheadline: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Supporting line</label>
              <textarea
                value={(content as any).supportingLine || ""}
                onChange={(e) =>
                  setContent({ ...content, supportingLine: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Headline tag</label>
                <select
                  value={(content as any).headlineTag || "h1"}
                  onChange={(e) =>
                    setContent({ ...content, headlineTag: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="h1">H1</option>
                  <option value="h2">H2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Content alignment</label>
                <select
                  value={(content as any).contentAlignment || "left"}
                  onChange={(e) =>
                    setContent({ ...content, contentAlignment: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Visual position</label>
              <select
                value={(content as any).visualPosition || "right"}
                onChange={(e) =>
                  setContent({ ...content, visualPosition: e.target.value })
                }
                className="w-full max-w-[220px] px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="right">Right</option>
                <option value="left">Left</option>
              </select>
            </div>
            <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-medium text-gray-700">Primary CTA</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={(content as any).primaryCtaText || ""}
                  onChange={(e) =>
                    setContent({ ...content, primaryCtaText: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Start Your Project"
                />
                <input
                  type="text"
                  value={(content as any).primaryCtaLink || ""}
                  onChange={(e) =>
                    setContent({ ...content, primaryCtaLink: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="/contact"
                />
              </div>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={(content as any).primaryCtaVisible ?? true}
                  onChange={(e) =>
                    setContent({ ...content, primaryCtaVisible: e.target.checked })
                  }
                  className="mr-2"
                />
                Show primary CTA
              </label>
            </div>
            <div className="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-medium text-gray-700">Secondary CTA</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={(content as any).secondaryCtaText || ""}
                  onChange={(e) =>
                    setContent({ ...content, secondaryCtaText: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Book Free Consultation"
                />
                <input
                  type="text"
                  value={(content as any).secondaryCtaLink || ""}
                  onChange={(e) =>
                    setContent({ ...content, secondaryCtaLink: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="/contact"
                />
              </div>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={(content as any).secondaryCtaVisible ?? true}
                  onChange={(e) =>
                    setContent({ ...content, secondaryCtaVisible: e.target.checked })
                  }
                  className="mr-2"
                />
                Show secondary CTA
              </label>
            </div>
            <div>
              <ImagePicker
                value={(content as any).heroImage || ""}
                onChange={(url) =>
                  setContent({ ...content, heroImage: url })
                }
                label="Hero visual image"
                prefix="hero-image"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Hero image alt text</label>
              <input
                type="text"
                value={(content as any).heroImageAlt || ""}
                onChange={(e) =>
                  setContent({ ...content, heroImageAlt: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Accent color</label>
                <input
                  type="color"
                  value={(content as any).accentColor || "#3b82f6"}
                  onChange={(e) =>
                    setContent({ ...content, accentColor: e.target.value })
                  }
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Text color</label>
                <input
                  type="color"
                  value={(content as any).textColor || "#ffffff"}
                  onChange={(e) =>
                    setContent({ ...content, textColor: e.target.value })
                  }
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Sub text color</label>
                <input
                  type="color"
                  value={(content as any).subTextColor || "#cbd5e1"}
                  onChange={(e) =>
                    setContent({ ...content, subTextColor: e.target.value })
                  }
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )
      case "textImage":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Text</label>
              <textarea
                value={(content as any).text || ""}
                onChange={(e) =>
                  setContent({ ...content, text: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={6}
              />
            </div>
            <div>
              <ImagePicker
                value={(content as any).image || ""}
                onChange={(url) =>
                  setContent({ ...content, image: url })
                }
                label="Image"
                prefix="media"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Alignment
              </label>
              <select
                value={(content as any).alignment || "left"}
                onChange={(e) =>
                  setContent({
                    ...content,
                    alignment: e.target.value as "left" | "right",
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        )
      case "imageSlider": {
        const images: string[] = Array.isArray((content as any).images)
          ? (content as any).images
          : []
        return (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Images
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      images: [...images, ""],
                    })
                  }
                  className="text-lg bg-gray-800 text-gray-100 px-3 py-1 rounded hover:bg-gray-300"
                >
                  Add image
                </button>
              </div>
              <div className="space-y-3">
                {images.map((url, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1">
                      <ImagePicker
                        value={url}
                        onChange={(newUrl) => {
                          const next = [...images]
                          next[index] = newUrl
                          setContent({ ...content, images: next })
                        }}
                        label={`Image ${index + 1}`}
                        prefix="media"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = images.filter((_, i) => i !== index)
                        setContent({ ...content, images: next })
                      }}
                      className="text-lg text-red-600 hover:text-red-800 mt-8"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={(content as any).autoplay || false}
                onChange={(e) =>
                  setContent({ ...content, autoplay: e.target.checked })
                }
                className="mr-2"
              />
              <label className="text-gray-700">Autoplay</label>
            </div>
          </div>
        )
      }
      case "headingParagraph":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Heading</label>
              <input
                type="text"
                value={(content as any).heading || ""}
                onChange={(e) =>
                  setContent({ ...content, heading: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Paragraphs (one per line)
              </label>
              <textarea
                value={
                  Array.isArray((content as any).paragraphs)
                    ? (content as any).paragraphs.join("\n")
                    : ""
                }
                onChange={(e) =>
                  setContent({
                    ...content,
                    paragraphs: e.target.value.split("\n").filter((p) => p),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={6}
              />
            </div>
          </div>
        )
      case "cards": {
        const cards: CardItem[] = Array.isArray((content as any).cards)
          ? (content as any).cards
          : []
        const getCardServices = (card: CardItem): CardServiceItem[] => {
          if (card.services && card.services.length > 0) return card.services
          const legacy = (card as { technologies?: string[] }).technologies
          if (Array.isArray(legacy) && legacy.length > 0) {
            return legacy.map((t) => ({ title: t, description: "" }))
          }
          return []
        }
        const inputClass =
          "w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Title</label>
              <input
                type="text"
                value={(content as any).title || ""}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Sub-text</label>
              <textarea
                value={(content as any).subText || ""}
                onChange={(e) => setContent({ ...content, subText: e.target.value })}
                className={inputClass}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Cards per row</label>
              <select
                value={(content as any).cardsPerRow ?? 3}
                onChange={(e) =>
                  setContent({ ...content, cardsPerRow: parseInt(e.target.value, 10) })
                }
                className={inputClass}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Cards</label>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      cards: [...cards, { heading: "", description: "" }],
                    })
                  }
                  className="text-lg bg-gray-800 text-gray-100 px-3 py-1 rounded hover:bg-gray-300"
                >
                  Add card
                </button>
              </div>
              <div className="space-y-6">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className="border border-gray-800 rounded-lg p-4 bg-gray-50 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Card {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = cards.filter((_, i) => i !== index)
                          setContent({ ...content, cards: next })
                        }}
                        className="text-lg text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                    <div>
                      <ImagePicker
                        value={card.image || ""}
                        onChange={(url) => {
                          const next = [...cards]
                          next[index] = { ...next[index], image: url }
                          setContent({ ...content, cards: next })
                        }}
                        label="Image"
                        prefix="media"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-600">Heading</label>
                      <input
                        type="text"
                        value={card.heading || ""}
                        onChange={(e) => {
                          const next = [...cards]
                          next[index] = { ...next[index], heading: e.target.value }
                          setContent({ ...content, cards: next })
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-600">
                        Description
                      </label>
                      <textarea
                        value={card.description || ""}
                        onChange={(e) => {
                          const next = [...cards]
                          next[index] = { ...next[index], description: e.target.value }
                          setContent({ ...content, cards: next })
                        }}
                        className={inputClass}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-600">
                        Overview (modal)
                      </label>
                      <textarea
                        value={card.overview || ""}
                        onChange={(e) => {
                          const next = [...cards]
                          next[index] = { ...next[index], overview: e.target.value }
                          setContent({ ...content, cards: next })
                        }}
                        className={inputClass}
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-600">
                        Open card in
                      </label>
                      <div className="flex gap-4 items-center">
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name={`card-open-${index}`}
                            checked={card.openInModal !== false}
                            onChange={() => {
                              const next = [...cards]
                              const { cardSlug: _, ...rest } = next[index]
                              next[index] = { ...rest, openInModal: true }
                              setContent({ ...content, cards: next })
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
                              const next = [...cards]
                              const slug =
                                next[index].cardSlug ||
                                slugify(next[index].heading || "") ||
                                `card-${index + 1}`
                              next[index] = {
                                ...next[index],
                                openInModal: false,
                                cardSlug: slug,
                              }
                              setContent({ ...content, cards: next })
                            }}
                          />
                          <span className="text-sm">New page</span>
                        </label>
                      </div>
                      {card.openInModal === false && (
                        <div className="mt-2">
                          <label className="block text-xs font-medium mb-1 text-gray-600">
                            Card URL slug
                          </label>
                          <input
                            type="text"
                            value={card.cardSlug || ""}
                            onChange={(e) => {
                              const next = [...cards]
                              next[index] = {
                                ...next[index],
                                cardSlug: e.target.value.trim() || slugify(next[index].heading || "") || `card-${index + 1}`,
                              }
                              setContent({ ...content, cards: next })
                            }}
                            placeholder={slugify(card.heading || "") || `card-${index + 1}`}
                            className={inputClass}
                          />
                          <p className="text-xs text-gray-500 mt-0.5">
                            URL will be /custom-type-slug/{card.cardSlug || "..."}
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
                            const next = [...cards]
                            const svcs: CardServiceItem[] = getCardServices(next[index])
                            svcs.push({ title: "", description: "" })
                            const { technologies, keyFeatures, ...rest } = next[index] as CardItem & {
                              technologies?: string[]
                              keyFeatures?: string[]
                            }
                            next[index] = { ...rest, services: svcs }
                            setContent({ ...content, cards: next })
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
                                  const next = [...cards]
                                  const svcs = [...getCardServices(next[index])]
                                  svcs[svcIdx] = { ...svcs[svcIdx], title: e.target.value }
                                  const { technologies, keyFeatures, ...rest } = next[index] as CardItem & {
                                    technologies?: string[]
                                    keyFeatures?: string[]
                                  }
                                  next[index] = { ...rest, services: svcs }
                                  setContent({ ...content, cards: next })
                                }}
                                className={inputClass}
                              />
                              <textarea
                                placeholder="Short description"
                                value={svc.description}
                                onChange={(e) => {
                                  const next = [...cards]
                                  const svcs = [...getCardServices(next[index])]
                                  svcs[svcIdx] = { ...svcs[svcIdx], description: e.target.value }
                                  const { technologies, keyFeatures, ...rest } = next[index] as CardItem & {
                                    technologies?: string[]
                                    keyFeatures?: string[]
                                  }
                                  next[index] = { ...rest, services: svcs }
                                  setContent({ ...content, cards: next })
                                }}
                                className={inputClass}
                                rows={2}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...cards]
                                const svcs = getCardServices(next[index]).filter(
                                  (_, i) => i !== svcIdx
                                )
                                const { technologies, keyFeatures, ...rest } = next[index] as CardItem & {
                                  technologies?: string[]
                                  keyFeatures?: string[]
                                }
                                next[index] = { ...rest, services: svcs }
                                setContent({ ...content, cards: next })
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
                        <label className="block text-xs font-medium mb-1 text-gray-600">
                          Live demo URL
                        </label>
                        <input
                          type="url"
                          value={card.liveDemoUrl || ""}
                          onChange={(e) => {
                            const next = [...cards]
                            next[index] = { ...next[index], liveDemoUrl: e.target.value }
                            setContent({ ...content, cards: next })
                          }}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-600">
                          Source code URL
                        </label>
                        <input
                          type="url"
                          value={card.sourceCodeUrl || ""}
                          onChange={(e) => {
                            const next = [...cards]
                            next[index] = { ...next[index], sourceCodeUrl: e.target.value }
                            setContent({ ...content, cards: next })
                          }}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }
      case "projectLifeCycle": {
        const phases: LifeCyclePhase[] = Array.isArray((content as any).phases)
          ? (content as any).phases
          : []
        const inputClass =
          "w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        const colors = ["blue", "green", "purple", "orange", "red", "grey"] as const
        const icons = ["document", "chart", "gear", "cog", "check", "rocket", "graduation", "wrench"] as const
        const addPhase = () => {
          const num = String(phases.length + 1).padStart(2, "0")
          setContent({
            ...content,
            phases: [
              ...phases,
              {
                number: num,
                title: "",
                description: "",
                color: "blue",
                icon: "gear",
                items: [{ heading: "", bullets: [""] }],
              },
            ],
          })
        }
        const updatePhase = (idx: number, updates: Partial<LifeCyclePhase>) => {
          const next = [...phases]
          next[idx] = { ...next[idx], ...updates }
          setContent({ ...content, phases: next })
        }
        const removePhase = (idx: number) => {
          const next = phases.filter((_, i) => i !== idx)
          setContent({ ...content, phases: next })
        }
        const updatePhaseItem = (phaseIdx: number, itemIdx: number, updates: Partial<LifeCyclePhaseItem>) => {
          const next = [...phases]
          const items = [...(next[phaseIdx].items || [])]
          items[itemIdx] = { ...items[itemIdx], ...updates }
          next[phaseIdx] = { ...next[phaseIdx], items }
          setContent({ ...content, phases: next })
        }
        const addPhaseItem = (phaseIdx: number) => {
          const next = [...phases]
          const items = [...(next[phaseIdx].items || []), { heading: "", bullets: [""] }]
          next[phaseIdx] = { ...next[phaseIdx], items }
          setContent({ ...content, phases: next })
        }
        const removePhaseItem = (phaseIdx: number, itemIdx: number) => {
          const next = [...phases]
          const items = next[phaseIdx].items.filter((_, i) => i !== itemIdx)
          next[phaseIdx] = { ...next[phaseIdx], items }
          setContent({ ...content, phases: next })
        }
        const updateBullet = (phaseIdx: number, itemIdx: number, bulletIdx: number, value: string) => {
          const next = [...phases]
          const bullets = [...(next[phaseIdx].items[itemIdx]?.bullets || [])]
          bullets[bulletIdx] = value
          next[phaseIdx].items[itemIdx] = { ...next[phaseIdx].items[itemIdx], bullets }
          setContent({ ...content, phases: next })
        }
        const addBullet = (phaseIdx: number, itemIdx: number) => {
          const next = [...phases]
          const bullets = [...(next[phaseIdx].items[itemIdx]?.bullets || []), ""]
          next[phaseIdx].items[itemIdx] = { ...next[phaseIdx].items[itemIdx], bullets }
          setContent({ ...content, phases: next })
        }
        const removeBullet = (phaseIdx: number, itemIdx: number, bulletIdx: number) => {
          const next = [...phases]
          const bullets = next[phaseIdx].items[itemIdx].bullets.filter((_, i) => i !== bulletIdx)
          next[phaseIdx].items[itemIdx] = { ...next[phaseIdx].items[itemIdx], bullets }
          setContent({ ...content, phases: next })
        }
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Section Title</label>
              <input
                type="text"
                value={(content as any).title || ""}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                className={inputClass}
                placeholder="Project Delivery Life Cycle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
              <textarea
                value={(content as any).description || ""}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                className={inputClass}
                rows={2}
                placeholder="A transparent, structured approach..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Hint (scroll instruction)</label>
              <input
                type="text"
                value={(content as any).hint || ""}
                onChange={(e) => setContent({ ...content, hint: e.target.value })}
                className={inputClass}
                placeholder="Use arrow buttons, scroll horizontally..."
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Phases</label>
                <button
                  type="button"
                  onClick={addPhase}
                  className="text-lg bg-gray-800 text-gray-100 px-3 py-1 rounded hover:bg-gray-300"
                >
                  Add phase
                </button>
              </div>
              <div className="space-y-6 max-h-[500px] overflow-y-auto">
                {phases.map((phase, pIdx) => (
                  <div key={pIdx} className="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Phase {phase.number || pIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removePhase(pIdx)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove phase
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-600">Number</label>
                        <input
                          type="text"
                          value={phase.number}
                          onChange={(e) => updatePhase(pIdx, { number: e.target.value })}
                          className={inputClass}
                          placeholder="01"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-600">Title</label>
                        <input
                          type="text"
                          value={phase.title}
                          onChange={(e) => updatePhase(pIdx, { title: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-gray-600">Description</label>
                      <input
                        type="text"
                        value={phase.description}
                        onChange={(e) => updatePhase(pIdx, { description: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-600">Color</label>
                        <select
                          value={phase.color}
                          onChange={(e) => updatePhase(pIdx, { color: e.target.value as LifeCyclePhase["color"] })}
                          className={inputClass}
                        >
                          {colors.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-600">Icon</label>
                        <select
                          value={phase.icon}
                          onChange={(e) => updatePhase(pIdx, { icon: e.target.value as LifeCyclePhase["icon"] })}
                          className={inputClass}
                        >
                          {icons.map((i) => (
                            <option key={i} value={i}>{i}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-medium text-gray-600">Sub-sections</label>
                        <button
                          type="button"
                          onClick={() => addPhaseItem(pIdx)}
                          className="text-sm bg-gray-700 text-white px-2 py-1 rounded"
                        >
                          Add sub-section
                        </button>
                      </div>
                      {phase.items?.map((item, iIdx) => (
                        <div key={iIdx} className="mt-2 p-3 bg-white rounded border border-gray-200 space-y-2">
                          <div className="flex justify-between">
                            <input
                              type="text"
                              placeholder="Sub-section heading"
                              value={item.heading}
                              onChange={(e) => updatePhaseItem(pIdx, iIdx, { heading: e.target.value })}
                              className={inputClass}
                            />
                            <button
                              type="button"
                              onClick={() => removePhaseItem(pIdx, iIdx)}
                              className="text-red-600 text-sm ml-2"
                            >
                              Remove
                            </button>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Bullets (one per line)</label>
                            <textarea
                              value={(item.bullets || []).join("\n")}
                              onChange={(e) =>
                                updatePhaseItem(pIdx, iIdx, {
                                  bullets: e.target.value.split("\n").filter((b) => b.trim() !== ""),
                                })
                              }
                              className={inputClass}
                              rows={3}
                              placeholder="Bullet 1&#10;Bullet 2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }
      case "customPostType": {
        const inputClass =
          "w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        const selectedCustomType = customTypeOptions.find(
          (item) => item.id === ((content as any).customTypeId || "")
        )
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Custom post type
              </label>
              <select
                value={(content as any).customTypeId || ""}
                onChange={(e) =>
                  setContent({ ...content, customTypeId: e.target.value })
                }
                className={inputClass}
              >
                <option value="">Select a custom post type</option>
                {customTypeOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.slug})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Number of items to show
              </label>
              <input
                type="number"
                min={1}
                max={24}
                value={(content as any).itemsToShow ?? 3}
                onChange={(e) =>
                  setContent({
                    ...content,
                    itemsToShow: Math.max(1, Number(e.target.value) || 1),
                  })
                }
                className="w-full max-w-[140px] px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                View more link
              </label>
              <select
                value={(content as any).viewMoreMode || "default"}
                onChange={(e) =>
                  setContent({
                    ...content,
                    viewMoreMode: e.target.value as "default" | "custom",
                  })
                }
                className={`${inputClass} max-w-[260px]`}
              >
                <option value="default">Default (selected custom post type page)</option>
                <option value="custom">Custom</option>
              </select>
              {(content as any).viewMoreMode !== "custom" && (
                <p className="text-xs text-gray-500 mt-1">
                  Default link:{" "}
                  {selectedCustomType ? `/${selectedCustomType.slug}` : "Select a custom post type"}
                </p>
              )}
            </div>
            {(content as any).viewMoreMode === "custom" && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Custom view more URL
                </label>
                <input
                  type="text"
                  value={(content as any).viewMoreLink || ""}
                  onChange={(e) =>
                    setContent({ ...content, viewMoreLink: e.target.value })
                  }
                  className={inputClass}
                  placeholder="/services or https://example.com/services"
                />
              </div>
            )}
          </div>
        )
      }
      default:
        return (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Content (JSON)</label>
            <textarea
              value={JSON.stringify(content, null, 2)}
              onChange={(e) => {
                try {
                  setContent(JSON.parse(e.target.value))
                } catch {}
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={10}
            />
          </div>
        )
    }
  }

  return (
    <div className="border rounded-lg p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity text-left"
        >
          <span
            className={`inline-block transition-transform ${isExpanded ? "rotate-0" : "rotate-90"}`}
            aria-hidden
          >
            ▼
          </span>
          <h3 className="text-lg font-semibold text-gray-900">
            {section.type === "hero"
              ? "Hero"
              : section.type === "projectLifeCycle"
              ? "Project Life Cycle"
              : section.type === "customPostType"
                ? "Custom Post Type"
                : section.type.replace(/([A-Z])/g, " $1").replace(/^\w/, (c) => c.toUpperCase())}{" "}
            Section
          </h3>
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => onDelete(section.id)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                className="w-24 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="mr-2"
              />
              <label className="text-gray-700">Visible</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Background color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={(content as any).backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    setContent({ ...content, backgroundColor: e.target.value })
                  }
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={(content as any).backgroundColor || ""}
                  onChange={(e) =>
                    setContent({ ...content, backgroundColor: e.target.value || null })
                  }
                  className="w-28 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Padding %</label>
              <input
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={(content as any).paddingPercent ?? 5}
                onChange={(e) =>
                  setContent({
                    ...content,
                    paddingPercent: e.target.value === "" ? null : parseFloat(e.target.value) || 0,
                  })
                }
                className="w-24 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {renderEditor()}
        </div>
      )}
    </div>
  )
}
