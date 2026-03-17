"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CustomTypeData, SectionData } from "@/types/cms"
import SectionEditor from "./SectionEditor"
import ImagePicker from "./ImagePicker"
import { getDefaultSectionContent } from "@/lib/section-defaults"
import { slugify } from "@/lib/slugify"

interface CustomTypeEditorProps {
  customType?: CustomTypeData
}

export default function CustomTypeEditor({ customType }: CustomTypeEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    slug: customType?.slug || "",
    name: customType?.name || "",
    showInHeader: customType?.showInHeader ?? true,
    showInFooter: customType?.showInFooter ?? true,
    isPublished: customType?.isPublished ?? false,
    order: customType?.order ?? 0,
    bannerBackgroundImage: customType?.bannerBackgroundImage ?? "",
    bannerOverlayColor: customType?.bannerOverlayColor ?? "#ffffff",
    bannerOverlayOpacity: customType?.bannerOverlayOpacity ?? 0.8,
    bannerTitle: customType?.bannerTitle ?? "",
    bannerText: customType?.bannerText ?? "",
    bannerButtonText: customType?.bannerButtonText ?? "",
    bannerButtonLink: customType?.bannerButtonLink ?? "",
    bannerButtonVisible: customType?.bannerButtonVisible ?? true,
    bannerImage: customType?.bannerImage ?? "",
    bannerHeightPercent: customType?.bannerHeightPercent ?? 60,
  })
  const [sections, setSections] = useState<SectionData[]>(customType?.sections || [])

  useEffect(() => {
    if (customType) {
      loadSections()
    }
  }, [customType])

  const loadSections = async () => {
    if (!customType) return
    try {
      const response = await fetch(`/api/sections?customTypeId=${customType.id}`)
      const data = await response.json()
      setSections(data)
    } catch (error) {
      console.error("Failed to load sections:", error)
    }
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: customType ? prev.slug : slugify(name) || prev.slug,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = customType ? `/api/custom-types/${customType.id}` : "/api/custom-types"
      const method = customType ? "PUT" : "POST"
      const payload = {
        ...formData,
        bannerBackgroundImage: formData.bannerBackgroundImage || null,
        bannerOverlayColor: formData.bannerOverlayColor || null,
        bannerTitle: formData.bannerTitle || null,
        bannerText: formData.bannerText || null,
        bannerButtonText: formData.bannerButtonText || null,
        bannerButtonLink: formData.bannerButtonLink || null,
        bannerImage: formData.bannerImage || null,
        bannerHeightPercent: formData.bannerHeightPercent ?? null,
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || "Failed to save custom type")
      }

      const saved = await response.json()
      router.push(`/admin/custom-types/${saved.id}`)
      router.refresh()
    } catch (error) {
      console.error("Error saving custom type:", error)
      alert(error instanceof Error ? error.message : "Failed to save custom type")
    } finally {
      setLoading(false)
    }
  }

  const addSection = async (type: string) => {
    if (!customType) {
      alert("Please save the custom type first before adding sections")
      return
    }

    try {
      const response = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customTypeId: customType.id,
          type,
          order: sections.length,
          content: getDefaultSectionContent(type),
          isVisible: true,
        }),
      })

      if (!response.ok) throw new Error("Failed to create section")

      const newSection = await response.json()
      setSections([...sections, newSection])
    } catch (error) {
      console.error("Error creating section:", error)
      alert("Failed to create section")
    }
  }

  const deleteSection = async (sectionId: string) => {
    try {
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete section")

      setSections(sections.filter((s) => s.id !== sectionId))
    } catch (error) {
      console.error("Error deleting section:", error)
      alert("Failed to delete section")
    }
  }

  const updateSection = (updatedSection: SectionData) => {
    setSections(sections.map((s) => (s.id === updatedSection.id ? updatedSection : s)))
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        {customType ? "Edit custom type" : "New custom type"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Who we are"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Slug (URL path)</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="who-we-are"
          />
          <p className="text-xs text-gray-500 mt-1">Page URL will be /{formData.slug || "..."}</p>
        </div>
        <div className="flex flex-wrap gap-6 items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.showInHeader}
              onChange={(e) => setFormData({ ...formData, showInHeader: e.target.checked })}
            />
            <span className="text-gray-700">Show in header menu</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.showInFooter}
              onChange={(e) => setFormData({ ...formData, showInFooter: e.target.checked })}
            />
            <span className="text-gray-700">Show in footer menu</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            />
            <span className="text-gray-700">Published (visible on site)</span>
          </label>
          <div className="flex items-center gap-2">
            <label className="text-gray-700">Order:</label>
            <input
              type="number"
              min={0}
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) || 0 })}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-gray-900"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 space-y-4 bg-gray-200 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900">Banner</h2>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Banner height (% of viewport)</label>
            <input
              type="number"
              min={20}
              max={100}
              value={formData.bannerHeightPercent ?? 60}
              onChange={(e) =>
                setFormData({ ...formData, bannerHeightPercent: Number(e.target.value) || 60 })
              }
              className="w-full max-w-[120px] px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
            />
          </div>
          <div>
            <ImagePicker
              value={formData.bannerBackgroundImage}
              onChange={(url) => setFormData({ ...formData, bannerBackgroundImage: url })}
              label="Background image"
              prefix="page-banner"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Overlay color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.bannerOverlayColor}
                  onChange={(e) => setFormData({ ...formData, bannerOverlayColor: e.target.value })}
                  className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.bannerOverlayColor}
                  onChange={(e) => setFormData({ ...formData, bannerOverlayColor: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Overlay opacity (0–1)</label>
              <input
                type="number"
                min={0}
                max={1}
                step={0.05}
                value={formData.bannerOverlayOpacity}
                onChange={(e) =>
                  setFormData({ ...formData, bannerOverlayOpacity: Number(e.target.value) || 0 })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Banner title</label>
            <input
              type="text"
              value={formData.bannerTitle}
              onChange={(e) => setFormData({ ...formData, bannerTitle: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Banner text</label>
            <textarea
              value={formData.bannerText}
              onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Banner button</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Button text</label>
                <input
                  type="text"
                  value={formData.bannerButtonText}
                  onChange={(e) => setFormData({ ...formData, bannerButtonText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Button link</label>
                <input
                  type="text"
                  value={formData.bannerButtonLink}
                  onChange={(e) => setFormData({ ...formData, bannerButtonLink: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white"
                />
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.bannerButtonVisible}
                onChange={(e) => setFormData({ ...formData, bannerButtonVisible: e.target.checked })}
              />
              <span className="text-gray-700 text-sm">Button visible</span>
            </label>
          </div>
          <div>
            <ImagePicker
              value={formData.bannerImage}
              onChange={(url) => setFormData({ ...formData, bannerImage: url })}
              label="Banner image (circular)"
              prefix="page-banner-image"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : customType ? "Save custom type" : "Create custom type"}
        </button>
      </form>

      {customType && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sections</h2>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => addSection("textImage")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Add Text + Image
              </button>
              <button
                type="button"
                onClick={() => addSection("imageSlider")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Add Image Slider
              </button>
              <button
                type="button"
                onClick={() => addSection("headingParagraph")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Add Heading + Paragraph
              </button>
              <button
                type="button"
                onClick={() => addSection("cards")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Add Cards
              </button>
              <button
                type="button"
                onClick={() => addSection("projectLifeCycle")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Add Project Life Cycle
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {sections.map((section) => (
              <SectionEditor
                key={section.id}
                section={section}
                onUpdate={updateSection}
                onDelete={deleteSection}
              />
            ))}
            {sections.length === 0 && (
              <p className="text-gray-500">No sections yet. Add one above.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
