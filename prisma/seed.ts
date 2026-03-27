import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { getDefaultSectionContent } from "../lib/section-defaults"

const prisma = new PrismaClient()

async function seedEnterpriseMvpSectionIfNeeded() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  })
  const homePageId = settings?.homePageId
  if (!homePageId) {
    console.log("No home page set in site settings; skip Section 2 seed.")
    return
  }

  const orderTaken = await prisma.section.findFirst({
    where: { pageId: homePageId, order: 1 },
  })
  if (orderTaken) {
    console.log("Home page already has a section at order 1; skip Section 2 seed.")
    return
  }

  const content = getDefaultSectionContent("headingParagraph") as object
  await prisma.section.create({
    data: {
      pageId: homePageId,
      type: "headingParagraph",
      order: 1,
      content,
      isVisible: true,
    },
  })
  console.log("Added Enterprise MVP content block (headingParagraph) at order 1 on home page.")
}

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("Admin@123", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      password: hashedPassword,
      name: "Admin User",
      role: "admin",
    },
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
      role: "admin",
    },
  })

  console.log("Admin user:", admin.email)
  console.log("Default password (dev seed): Admin@123")
  console.log("⚠️  Change this password in production and avoid committing real secrets.")

  await seedEnterpriseMvpSectionIfNeeded()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
