import FooterSettingsForm from "@/components/admin/FooterSettingsForm"
import HeaderSettingsForm from "@/components/admin/HeaderSettingsForm"
import { getOrCreateSettings } from "@/lib/db/settings"

export default async function SettingsPage() {
  const settings = await getOrCreateSettings()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Header branding
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Choose to display text or a logo in the site header.
        </p>
        <HeaderSettingsForm
          initialBrandType={
            settings.headerBrandType === "logo" ? "logo" : "text"
          }
          initialBrandText={settings.headerBrandText ?? null}
          initialLogoUrl={settings.headerLogoUrl ?? null}
        />
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Footer visibility
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Choose which sections appear in the site footer. Each section is shown
          in its own column when visible.
        </p>
        <FooterSettingsForm
          initialSettings={{
            footerAboutVisible: settings.footerAboutVisible,
            footerAboutText: settings.footerAboutText ?? null,
            footerMenuVisible: settings.footerMenuVisible,
            footerSocialVisible: settings.footerSocialVisible,
            footerSubscribeVisible: settings.footerSubscribeVisible,
            footerSocialJson:
              settings.footerSocialJson != null
                ? (settings.footerSocialJson as {
                    fb?: { url?: string; text?: string }
                    insta?: { url?: string }
                    twitter?: { url?: string }
                    linkedin?: { url?: string }
                    website?: { url?: string }
                  })
                : null,
            footerContactJson:
              settings.footerContactJson != null
                ? (settings.footerContactJson as {
                    name?: string
                    email?: string
                    phone1?: string
                    phone2?: string
                    address?: string
                  })
                : null,
          }}
        />
      </section>
    </div>
  )
}
