import Link from "next/link"
import { prisma } from "@/lib/db/prisma"

export default async function CustomTypesPage() {
  const customTypes = await prisma.customType.findMany({
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
  })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Custom types</h1>
        <Link
          href="/admin/custom-types/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          New custom type
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Header
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Footer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customTypes.map((ct) => (
              <tr key={ct.id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{ct.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">/{ct.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{ct.order}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {ct.showInHeader ? "Yes" : "No"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {ct.showInFooter ? "Yes" : "No"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      ct.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {ct.isPublished ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/admin/custom-types/${ct.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {customTypes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No custom types yet. Create your first one!
          </div>
        )}
      </div>
    </div>
  )
}
