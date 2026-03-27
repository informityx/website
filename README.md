# Next.js CMS

A modern, flexible Content Management System built with Next.js, TypeScript, Prisma, and PostgreSQL. Designed for serverless deployment with dynamic pages, a flexible section system, and a full admin dashboard.

## Features

- **Dynamic Pages**: Create and manage pages with flexible, orderable sections
- **Section System**: Multiple section types (Text+Image, Image Slider, Heading+Paragraph) with extensible renderer
- **Services Management**: Full CRUD for services with listing, detail page, and modal views
- **Admin Dashboard**: Protected admin interface for pages, services, and section management
- **SEO Optimized**: Dynamic metadata, JSON-LD, sitemap generation, and ISR support
- **Authentication**: Secure admin access with NextAuth.js v5 (Auth.js)
- **Modern UI**: Clean, minimal design with Tailwind CSS and shadcn/ui

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: Vercel Postgres (PostgreSQL) — serverless-ready, no external hosting
- **ORM**: Prisma (type-safe database access)
- **Authentication**: NextAuth.js v5 (Auth.js)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Image Handling**: Next.js Image + Vercel Blob Storage (for media)

## Getting Started

### Prerequisites

- Node.js 20.19+, 22.12+, or 24.0+
- PostgreSQL database (local or [Vercel Postgres](https://vercel.com/storage/postgres))
- npm or yarn

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cms?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Public URL for sitemap
NEXT_PUBLIC_URL="http://localhost:3000"
```

3. Set up the database:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (development only; quick sync without migration files)
npm run db:push

# Or create / apply migrations (preferred when you use prisma/migrations)
npm run db:migrate
```

`npm run build` only runs `db:generate` and `next build`; Prisma does **not** open a database connection during that step, so the DB host does not need to be reachable from the build machine (unlike `db push` or `migrate deploy`). You should still define `DATABASE_URL` wherever the build runs if your tooling or Prisma expects it.

4. Create an admin user:

You'll need to create an admin user manually in the database. You can use Prisma Studio:

```bash
npm run db:studio
```

Or create a seed script to add a default admin user.

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
cms/
├── app/
│   ├── (public)/              # Public routes
│   │   ├── page.tsx           # Home page
│   │   ├── about/page.tsx     # About page
│   │   ├── services/
│   │   │   ├── page.tsx       # Services listing
│   │   │   └── [slug]/page.tsx # Service detail page
│   │   ├── contact/page.tsx   # Contact page
│   │   └── [...slug]/page.tsx # Dynamic catch-all for CMS pages
│   ├── (admin)/               # Admin routes (protected)
│   │   ├── admin/
│   │   │   ├── layout.tsx     # Admin layout with sidebar
│   │   │   ├── page.tsx       # Admin dashboard
│   │   │   ├── pages/         # Pages management
│   │   │   ├── services/      # Services management
│   │   │   └── sections/      # Section types management
│   │   └── api/auth/[...nextauth]/route.ts
│   ├── api/
│   │   ├── pages/             # Page CRUD
│   │   ├── sections/          # Section CRUD
│   │   ├── services/          # Service CRUD
│   │   └── media/             # Media upload
│   └── layout.tsx             # Root layout
├── components/
│   ├── public/                # Public-facing components
│   │   ├── sections/          # Section renderers (TextImage, ImageSlider, etc.)
│   │   ├── services/          # ServiceCard, ServiceModal, ServiceList
│   │   └── layout/            # Header, Footer
│   └── admin/                 # Sidebar, PageEditor, SectionEditor, ServiceEditor
├── lib/
│   ├── db/prisma.ts           # Prisma client
│   ├── auth.ts                # NextAuth configuration
│   └── utils.ts
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/
└── types/
    └── cms.ts                 # TypeScript types
```

## Database Schema

The CMS uses Prisma with the following models:

- **User**: Admin users (email, hashed password, role) for NextAuth
- **Page**: Dynamic pages with unique slug, title, metadata, and ordered sections
- **Section**: Flexible sections with `type`, `order`, and JSON `content` (e.g. `textImage`, `imageSlider`, `headingParagraph`)
- **Service**: Services with slug, title, description, image, optional rich content, and publish flag

Section content is structured per type (e.g. TextImage: `{ text, image, alignment }`). Future phases can add a `SectionType` model for admin-defined section schemas.

## Architecture Overview

- **Public flow**: Static pages (home, about, contact), dynamic `[...slug]` pages from DB, and services listing/detail. Pages render via a section renderer that maps section type to components.
- **Admin flow**: NextAuth login → dashboard → Pages/Services/Sections management via API routes (`/api/pages`, `/api/services`, `/api/sections`) backed by Prisma and Vercel Postgres.
- **API pattern**: GET/POST/PUT/DELETE with session checks for admin-only mutations.

Implementation follows a phased plan: **Foundation** (Next.js, Prisma, NextAuth, Tailwind/shadcn) → **Public frontend** (layout, static/dynamic pages, section renderer, services) → **Admin dashboard** (layout, pages/services/sections CRUD, media) → **SEO & optimization** (metadata, JSON-LD, ISR, sitemap) → **Future** (dynamic section types, preview, versioning).

## Deployment

### Vercel (Recommended)

Vercel Postgres is the recommended database: no external hosting, serverless-ready, connection pooling, and a free tier (256 MB on Hobby).

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your database (e.g. **Vercel Postgres** or [Prisma Postgres](https://www.prisma.io/postgres)) and set **`DATABASE_URL`** in the Vercel project **Environment Variables** (Production and Preview as needed)
4. Set `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and `NEXT_PUBLIC_URL` to your deployment URLs
5. Deploy (the build runs `prisma generate` + `next build` only)
6. **Apply the schema to the remote database** after the first deploy or whenever you add migrations — from your machine, with the same connection string Vercel uses:

```bash
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

Or: `npm run db:migrate:deploy` with `DATABASE_URL` in `.env` / `.env.local` pointed at production. For a throwaway dev database you can still use `npm run db:push` instead of migrations.

Repeat step 6 whenever you ship new files under `prisma/migrations/`.

Enable serverless functions and configure ISR revalidation as needed for dynamic pages.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (from Vercel Postgres when using Vercel) |
| `NEXTAUTH_SECRET` | Secret for session encryption |
| `NEXTAUTH_URL` | Deployment URL (e.g. `https://your-app.vercel.app`) |
| `NEXT_PUBLIC_URL` | Public URL (for sitemap, etc.) |

## Security

- **Authentication**: NextAuth.js handles secure sessions and credentials
- **API protection**: Admin routes check session and role before mutations
- **Database**: Prisma parameterized queries help prevent SQL injection

## Usage

### Creating Pages

1. Log in to the admin dashboard at `/admin/login`
2. Navigate to "Pages" in the sidebar
3. Click "Create New Page"
4. Fill in the page details (slug, title, metadata)
5. Save the page
6. Add sections to the page (Text+Image, Image Slider, etc.)

### Managing Services

1. Go to "Services" in the admin dashboard
2. Click "Create New Service"
3. Fill in service details
4. Services will appear on the public `/services` page

### Section Types

Currently supported section types:
- **TextImage**: Text with an image (left or right alignment)
- **ImageSlider**: Image carousel/slider
- **HeadingParagraph**: Heading with multiple paragraphs

More section types can be added by extending the section renderer system.

## Development

### Database Migrations

```bash
# Create a new migration
npm run db:migrate

# Apply migrations
npm run db:push
```

### Prisma Studio

View and edit your database:

```bash
npm run db:studio
```

## License

MIT
