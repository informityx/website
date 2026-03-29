// Type definitions for CMS entities

export interface PageData {
  id: string
  slug: string
  title: string
  metaTitle?: string | null
  metaDescription?: string | null
  isPublished: boolean
  mobileMenuIcon?: string | null
  bannerBackgroundImage?: string | null
  bannerOverlayColor?: string | null
  bannerOverlayOpacity?: number | null
  bannerTitle?: string | null
  bannerText?: string | null
  bannerButtonText?: string | null
  bannerButtonLink?: string | null
  bannerButtonVisible?: boolean | null
  bannerImage?: string | null
  bannerHeightPercent?: number | null
  sections: SectionData[]
  createdAt: Date
  updatedAt: Date
}

export interface SectionData {
  id: string
  pageId?: string | null
  customTypeId?: string | null
  type: SectionType
  order: number
  content: SectionContent
  isVisible: boolean
  createdAt: Date
  updatedAt: Date
}

export type SectionType =
  | "hero"
  | "textImage"
  | "imageSlider"
  | "headingParagraph"
  | "cards"
  | "projectLifeCycle"
  | "customPostType"
  | string // Allow for future dynamic types

export interface CardServiceItem {
  title: string
  description: string
}

export interface CardItem {
  image?: string
  heading: string
  description?: string
  overview?: string
  services?: CardServiceItem[]
  liveDemoUrl?: string
  sourceCodeUrl?: string
  /** When false, card opens at /basePath/cardSlug instead of modal. Default true. */
  openInModal?: boolean
  /** URL segment when openInModal is false (e.g. "ai-application"). */
  cardSlug?: string
}

export interface SectionContent {
  // Section layout (all section types)
  backgroundColor?: string | null
  paddingPercent?: number | null

  // Hero section
  eyebrow?: string
  headline?: string
  subheadline?: string
  supportingLine?: string
  headlineTag?: "h1" | "h2"
  contentAlignment?: "left" | "center"
  visualPosition?: "right" | "left"
  primaryCtaText?: string
  primaryCtaLink?: string
  primaryCtaVisible?: boolean
  secondaryCtaText?: string
  secondaryCtaLink?: string
  secondaryCtaVisible?: boolean
  heroImage?: string
  heroImageAlt?: string
  accentColor?: string
  textColor?: string
  subTextColor?: string

  // TextImage section
  text?: string
  image?: string
  alignment?: "left" | "right"

  // ImageSlider section
  images?: string[]
  autoplay?: boolean

  // HeadingParagraph / content block — simple (heading + paragraphs) or split (MVP USP, marketing); split uses `image` + `imageAlt`
  layout?: "simple" | "split"
  heading?: string
  paragraphs?: string[]
  body?: string
  imageAlt?: string
  valuePoints?: string[]
  trustPoints?: string[]
  badgeText?: string
  showTimeline?: boolean
  timelineLabels?: string[]

  // Cards section
  title?: string
  subText?: string
  cardsPerRow?: number
  cards?: CardItem[]

  // Project Life Cycle section
  phases?: Array<{
    number: string
    title: string
    tagline?: string
    description: string
    color: "blue" | "green" | "purple" | "orange" | "red" | "grey"
    icon: "document" | "chart" | "gear" | "cog" | "check" | "rocket" | "graduation" | "wrench"
    items: Array<{ heading: string; bullets: string[] }>
  }>

  // Custom Post Type section
  customTypeId?: string
  itemsToShow?: number
  viewMoreMode?: "default" | "custom"
  viewMoreLink?: string

  // Generic for future types
  [key: string]: any
}

export interface ServiceData {
  id: string
  slug: string
  title: string
  description?: string | null
  shortDescription?: string | null
  image?: string | null
  content?: any
  isPublished: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface CustomTypeData {
  id: string
  slug: string
  name: string
  showInHeader: boolean
  showInFooter: boolean
  /** List each card under this CPT in header/footer nav dropdowns */
  showCardsInNav: boolean
  isPublished: boolean
  order: number
  mobileMenuIcon?: string | null
  bannerBackgroundImage?: string | null
  bannerOverlayColor?: string | null
  bannerOverlayOpacity?: number | null
  bannerTitle?: string | null
  bannerText?: string | null
  bannerButtonText?: string | null
  bannerButtonLink?: string | null
  bannerButtonVisible?: boolean | null
  bannerImage?: string | null
  bannerHeightPercent?: number | null
  sections?: SectionData[]
  createdAt: Date
  updatedAt: Date
}

export interface SiteSettingsData {
  id: string
  homePageId: string | null
  footerAboutVisible: boolean
  footerAboutText: string | null
  footerMenuVisible: boolean
  footerSocialVisible: boolean
  footerSubscribeVisible: boolean
  footerSocialJson: FooterSocialData | null
  footerContactJson: FooterContactData | null
  updatedAt: Date
}

export interface FooterSocialData {
  fb?: { url?: string; text?: string }
  insta?: { url?: string; text?: string }
  twitter?: { url?: string; text?: string }
  linkedin?: { url?: string; text?: string }
  website?: { url?: string; text?: string }
}

export interface FooterContactData {
  name?: string
  email?: string
  phone1?: string
  phone2?: string
  address?: string
}
