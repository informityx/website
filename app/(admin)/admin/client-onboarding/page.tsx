import { prisma } from "@/lib/db/prisma"
import Link from "next/link"

export default async function ClientOnboardingPage() {
  const submissions = await prisma.clientOnboardingSubmission.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Client Onboarding</h1>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Company Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {submissions.map((sub) => {
              const data = sub.data as Record<string, unknown>
              const companyName = (data.companyName as string) ?? "—"
              const contact = (data.mainPointOfContact as string) ?? "—"
              return (
                <tr key={sub.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {sub.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/client-onboarding/${sub.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {submissions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No submissions yet.
          </div>
        )}
      </div>
    </div>
  )
}
