import { prisma } from "@/lib/db/prisma"
import Link from "next/link"

export default async function GetInTouchPage() {
  const submissions = await prisma.getInTouchSubmission.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Get In Touch</h1>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Inquiry Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Subject
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
            {submissions.map((sub) => (
              <tr key={sub.id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{sub.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a href={`mailto:${sub.email}`} className="text-blue-600 hover:text-blue-800">
                    {sub.email}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{sub.company ?? "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{sub.inquiryType}</td>
                <td className="px-6 py-4 max-w-xs truncate text-gray-500">{sub.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {sub.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/admin/get-in-touch/${sub.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
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
