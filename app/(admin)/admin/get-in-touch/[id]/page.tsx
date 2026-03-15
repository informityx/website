import { prisma } from "@/lib/db/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function GetInTouchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sub = await prisma.getInTouchSubmission.findUnique({
    where: { id },
  })

  if (!sub) notFound()

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/admin/get-in-touch"
          className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
        >
          ← Back to list
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Get In Touch Submission</h1>
        <p className="text-gray-500 text-sm mt-1">{sub.createdAt.toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 space-y-4 max-w-2xl">
        <div>
          <span className="text-sm font-medium text-gray-500">Full Name</span>
          <p className="text-gray-900">{sub.fullName}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-500">Email</span>
          <p className="text-gray-900">
            <a href={`mailto:${sub.email}`} className="text-blue-600 hover:text-blue-800">
              {sub.email}
            </a>
          </p>
        </div>
        {sub.phone && (
          <div>
            <span className="text-sm font-medium text-gray-500">Phone</span>
            <p className="text-gray-900">
              <a href={`tel:${sub.phone}`} className="text-blue-600 hover:text-blue-800">
                {sub.phone}
              </a>
            </p>
          </div>
        )}
        {sub.company && (
          <div>
            <span className="text-sm font-medium text-gray-500">Company</span>
            <p className="text-gray-900">{sub.company}</p>
          </div>
        )}
        <div>
          <span className="text-sm font-medium text-gray-500">Inquiry Type</span>
          <p className="text-gray-900">{sub.inquiryType}</p>
        </div>
        {sub.budget && (
          <div>
            <span className="text-sm font-medium text-gray-500">Budget</span>
            <p className="text-gray-900">{sub.budget}</p>
          </div>
        )}
        {sub.timeline && (
          <div>
            <span className="text-sm font-medium text-gray-500">Timeline</span>
            <p className="text-gray-900">{sub.timeline}</p>
          </div>
        )}
        <div>
          <span className="text-sm font-medium text-gray-500">Subject</span>
          <p className="text-gray-900">{sub.subject}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-500">Message</span>
          <p className="text-gray-900 whitespace-pre-wrap mt-1">{sub.message}</p>
        </div>
      </div>
    </div>
  )
}
