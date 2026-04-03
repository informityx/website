import Link from "next/link"
import { prisma } from "@/lib/db/prisma"
import SetHomePageButton from "@/components/admin/SetHomePageButton"
import { getOrCreateSettings } from "@/lib/db/settings"

type PageRow = Awaited<
  ReturnType<typeof prisma.page.findMany<{ include: { _count: { select: { sections: true } } } }>>
>[number]

export default async function PagesPage() {
  const [pages, customTypes, settings] = await Promise.all([
    prisma.page.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { sections: true },
        },
      },
    }),
    prisma.customType.findMany({
      orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
    }),
    getOrCreateSettings(),
  ])
  const homePageId = settings.homePageId ?? null

  return (
    <div className="p-8 space-y-12">
      <section aria-labelledby="pages-heading">
        <div className="flex justify-between items-center mb-6">
          <h1 id="pages-heading" className="text-3xl font-bold text-gray-900">
            Pages
          </h1>
          <Link
            href="/admin/pages/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create new page
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sections
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Home
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pages.map((page: PageRow) => (
                <tr key={page.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{page.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    /{page.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {page._count.sections}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        page.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {page.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <SetHomePageButton
                      pageId={page.id}
                      isCurrentHome={page.id === homePageId}
                      variant="button"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/pages/${page.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pages.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No pages found. Create your first page!
            </div>
          )}
        </div>
      </section>

      <section id="custom-types" aria-labelledby="custom-types-heading">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 id="custom-types-heading" className="text-2xl font-bold text-gray-900">
              Custom types
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Page-like content with its own URL (e.g. articles, portfolio).
            </p>
          </div>
          <Link
            href="/admin/custom-types/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shrink-0"
          >
            Create new
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
      </section>
    </div>
  )
}
