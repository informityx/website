import { prisma } from "@/lib/db/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"

const LABELS: Record<string, string> = {
  companyName: "Company Name",
  mainPointOfContact: "Main Point of Contact",
  preferredCommunicationChannel: "Preferred Communication Channel",
  contactInfo: "Contact Info",
  companyDescription: "What does your company do?",
  targetCustomer: "Who is your target customer?",
  businessUnique: "What makes your business unique?",
  problemSolving: "What problem are we solving?",
  desiredCoreFeatures: "Desired core features?",
  existingSystem: "Any existing system or website?",
  technicalConstraints: "Technical constraints?",
  competitorsAdmire: "Competitors you admire?",
  logoBrandGuide: "Logo & brand guide?",
  colorPreferences: "Color preferences?",
  toneOfVoice: "Tone of voice",
  paymentGateways: "Preferred payment gateways?",
  specificIntegrations: "Specific integrations?",
  adminControlExpectations: "Admin control expectations?",
  gdprRequired: "GDPR compliance required?",
  termsPrivacyAvailable: "Terms & Privacy links available?",
  idealLaunchDate: "Ideal launch date?",
  budgetRange: "Budget range?",
  postMvpFeatures: "Post-MVP features planned?",
  longTermGoals: "Long-term product goals?",
}

function formatKey(key: string): string {
  return LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())
}

export default async function ClientOnboardingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sub = await prisma.clientOnboardingSubmission.findUnique({
    where: { id },
  })

  if (!sub) notFound()

  const data = sub.data as Record<string, unknown>

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/admin/client-onboarding"
          className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
        >
          ← Back to list
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Client Onboarding Submission</h1>
        <p className="text-gray-500 text-sm mt-1">{sub.createdAt.toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
        {Object.entries(data).map(([key, value]) => {
          if (value === undefined || value === null || value === "") return null
          const display =
            typeof value === "boolean"
              ? value
                ? "Yes"
                : "No"
              : String(value)
          return (
            <div key={key}>
              <span className="text-sm font-medium text-gray-500">{formatKey(key)}</span>
              <p className="text-gray-900 whitespace-pre-wrap mt-1">{display}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
