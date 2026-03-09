"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface FooterSocialData {
  fb?: { url?: string; text?: string }
  insta?: { url?: string; text?: string }
  twitter?: { url?: string; text?: string }
  linkedin?: { url?: string; text?: string }
  website?: { url?: string; text?: string }
}

interface FooterContactData {
  name?: string
  email?: string
  phone1?: string
  phone2?: string
  address?: string
}

interface FooterSettings {
  footerAboutVisible: boolean
  footerAboutText: string | null
  footerMenuVisible: boolean
  footerSocialVisible: boolean
  footerSubscribeVisible: boolean
  footerSocialJson: FooterSocialData | null
  footerContactJson: FooterContactData | null
}

interface FooterSettingsFormProps {
  initialSettings: FooterSettings
}

const VISIBILITY_SECTIONS: {
  key: keyof Pick<
    FooterSettings,
    | "footerAboutVisible"
    | "footerMenuVisible"
    | "footerSocialVisible"
    | "footerSubscribeVisible"
  >
  label: string
}[] = [
  { key: "footerAboutVisible", label: "About us" },
  { key: "footerMenuVisible", label: "Our menu (custom menu)" },
  { key: "footerSocialVisible", label: "Social media" },
  { key: "footerSubscribeVisible", label: "Contact info" },
]

const emptySocial: FooterSocialData = {}
const emptyContact: FooterContactData = {}

export default function FooterSettingsForm({
  initialSettings,
}: FooterSettingsFormProps) {
  const router = useRouter()
  const [visibility, setVisibility] = useState({
    footerAboutVisible: initialSettings.footerAboutVisible,
    footerMenuVisible: initialSettings.footerMenuVisible,
    footerSocialVisible: initialSettings.footerSocialVisible,
    footerSubscribeVisible: initialSettings.footerSubscribeVisible,
  })
  const [social, setSocial] = useState<FooterSocialData>(
    initialSettings.footerSocialJson ?? emptySocial
  )
  const [contact, setContact] = useState<FooterContactData>(
    initialSettings.footerContactJson ?? emptyContact
  )
  const [aboutText, setAboutText] = useState<string>(
    initialSettings.footerAboutText ?? ""
  )
  const [loading, setLoading] = useState(false)
  const [savingContent, setSavingContent] = useState(false)

  const handleToggle = async (
    key: keyof typeof visibility,
    value: boolean
  ) => {
    const next = { ...visibility, [key]: value }
    setVisibility(next)
    setLoading(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...next,
          footerAboutText: aboutText.trim() || null,
          footerSocialJson: social,
          footerContactJson: contact,
        }),
      })
      if (!res.ok) throw new Error("Failed to update settings")
      router.refresh()
    } catch (err) {
      console.error(err)
      setVisibility(visibility)
      alert("Failed to update settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveContent = async () => {
    setSavingContent(true)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...visibility,
          footerAboutText: aboutText.trim() || null,
          footerSocialJson: social,
          footerContactJson: contact,
        }),
      })
      if (!res.ok) throw new Error("Failed to save")
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Failed to save footer content")
    } finally {
      setSavingContent(false)
    }
  }

  return (
    <>
      <div className="m-4">
        <button
          type="button"
          onClick={handleSaveContent}
          disabled={savingContent}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {savingContent ? "Saving..." : "Save footer content (about, social & contact)"}
        </button>
      </div>
      <div className="w-full flex gap-4 mt-0 flex-wrap">
        <div className="flex-1 min-w-0 min-w-[280px] bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h3 className="font-semibold text-gray-900">About us</h3>
          <p className="text-sm text-gray-600">
            Text shown in the About us footer column when that section is
            visible. Leave empty to use the default message.
          </p>
          <textarea
            placeholder="Your trusted partner for quality content and services."
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y"
          />
        </div>
        <div className="flex-1 min-w-0 min-w-[280px] bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h3 className="font-semibold text-gray-900">Section visibility</h3>
          {VISIBILITY_SECTIONS.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <label htmlFor={key} className="text-gray-700 font-medium">
                {label}
              </label>
              <input
                id={key}
                type="checkbox"
                checked={visibility[key]}
                onChange={(e) => handleToggle(key, e.target.checked)}
                disabled={loading}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          ))}
          {loading && <p className="text-sm text-gray-500">Saving...</p>}
        </div>

        <div className="flex-1 min-w-0 bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h3 className="font-semibold text-gray-900">Social media links</h3>
          <p className="text-sm text-gray-600">
            Optional links for the Social media footer column. Add URL and
            optional display text for each.
          </p>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="url"
                  placeholder="URL"
                  value={social.fb?.url ?? ""}
                  onChange={(e) =>
                    setSocial({
                      ...social,
                      fb: { ...social.fb, url: e.target.value || undefined },
                    })
                  }
                  className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Display text (optional)"
                  value={social.fb?.text ?? ""}
                  onChange={(e) =>
                    setSocial({
                      ...social,
                      fb: { ...social.fb, text: e.target.value || undefined },
                    })
                  }
                  className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="url"
                  placeholder="URL"
                  value={social.insta?.url ?? ""}
                  onChange={(e) =>
                    setSocial({
                      ...social,
                      insta: { ...social.insta, url: e.target.value || undefined },
                    })
                  }
                  className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Display text (optional)"
                  value={social.insta?.text ?? ""}
                  onChange={(e) =>
                    setSocial({
                      ...social,
                      insta: { ...social.insta, text: e.target.value || undefined },
                    })
                  }
                  className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
              </label>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="url"
                  placeholder="URL"
                  value={social.twitter?.url ?? ""}
                  onChange={(e) =>
                    setSocial({
                      ...social,
                      twitter: { ...social.twitter, url: e.target.value || undefined },
                    })
                  }
                  className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Display text (optional)"
                  value={social.twitter?.text ?? ""}
                  onChange={(e) =>
                    setSocial({
                      ...social,
                      twitter: { ...social.twitter, text: e.target.value || undefined },
                    })
                  }
                  className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="url"
                  placeholder="URL"
                  value={social.linkedin?.url ?? ""}
                  onChange={(e) =>
                    setSocial({
                      ...social,
                      linkedin: { ...social.linkedin, url: e.target.value || undefined },
                    })
                  }
                  className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Display text (optional)"
                  value={social.linkedin?.text ?? ""}
                  onChange={(e) =>
                    setSocial({
                      ...social,
                      linkedin: { ...social.linkedin, text: e.target.value || undefined },
                    })
                  }
                  className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="url"
                  placeholder="URL"
                  value={social.website?.url ?? ""}
                  onChange={(e) =>
                    setSocial({
                      ...social,
                      website: { ...social.website, url: e.target.value || undefined },
                    })
                  }
                  className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  placeholder="Display text (optional)"
                  value={social.website?.text ?? ""}
                  onChange={(e) =>
                    setSocial({
                      ...social,
                      website: { ...social.website, text: e.target.value || undefined },
                    })
                  }
                  className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <h3 className="font-semibold text-gray-900">Contact info</h3>
          <p className="text-sm text-gray-600">
            Shown in the Contact info footer column. Email and phones will be
            clickable (mailto / tel). Address will link to Google Maps.
          </p>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Name"
                value={contact.name ?? ""}
                onChange={(e) =>
                  setContact({ ...contact, name: e.target.value || undefined })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={contact.email ?? ""}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value || undefined })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone 1
              </label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                value={contact.phone1 ?? ""}
                onChange={(e) =>
                  setContact({ ...contact, phone1: e.target.value || undefined })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone 2
              </label>
              <input
                type="tel"
                placeholder="+1 234 567 8901"
                value={contact.phone2 ?? ""}
                onChange={(e) =>
                  setContact({ ...contact, phone2: e.target.value || undefined })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                placeholder="Address (links to Google Maps)"
                value={contact.address ?? ""}
                onChange={(e) =>
                  setContact({
                    ...contact,
                    address: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
