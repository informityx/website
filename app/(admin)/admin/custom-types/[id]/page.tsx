import { notFound } from "next/navigation"
import { prisma } from "@/lib/db/prisma"
import CustomTypeEditor from "@/components/admin/CustomTypeEditor"
import type { CustomTypeData, SectionData } from "@/types/cms"

export default async function EditCustomTypePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const customType = await prisma.customType.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!customType) {
    notFound()
  }

  const customTypeData: CustomTypeData = {
    ...customType,
    sections: customType.sections as SectionData[],
  }

  return <CustomTypeEditor customType={customTypeData} />
}
