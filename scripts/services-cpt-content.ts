/**
 * Services CPT + cards content aligned with docs/inforMityx.ai.pdf (Services) and the
 * Enterprise MVP themes in lib/section-defaults.ts. PDF text was not machine-extracted;
 * headings mirror the six delivery pillars from Section 2 for a single source of narrative.
 *
 * Field mapping: CPT name → home teaser H2; cards.title/subText → full /our-services grid;
 * CardItem.heading/description/overview/services → grid + modal/detail (see plan table).
 *
 * Card images: Unsplash (https://unsplash.com/license) — static hotlinks to images.unsplash.com.
 */

import type { CardItem } from "../types/cms"

/** Unsplash CDN params: consistent crop width for cards + modal. */
const u = (photoPath: string) =>
  `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=1200&q=80`
import { getDefaultSectionContent } from "../lib/section-defaults"

export const SERVICES_CPT_SLUG = "our-services"
export const SERVICES_CPT_NAME = "Services"
/** How many cards the home `customPostType` section shows (all six services). */
export const SERVICES_ITEMS_TO_SHOW = 6
/** Cards section on the CPT (first block). */
export const SERVICES_CARDS_SECTION_ORDER = 0
/** Home page section order after hero (0) and MVP headingParagraph (1). */
export const SERVICES_HOME_SECTION_ORDER = 2

const cards: CardItem[] = [
  {
    image: u("photo-1542744173-8e7e53415bb0"),
    heading: "Product Strategy & Technical Planning",
    description:
      "Discovery, scope, and architecture decisions before a single sprint starts.",
    overview:
      "We align stakeholders on outcomes, constraints, and technical approach so your MVP ships on scope—not surprises. Workshops, backlog shaping, and a clear technical plan feed directly into the 40-day delivery track.",
    services: [
      { title: "Discovery workshops", description: "Goals, users, and success metrics." },
      { title: "Scope & backlog", description: "Prioritized features for the first release." },
      { title: "Technical blueprint", description: "Stack, integrations, and scalability notes." },
    ],
    openInModal: true,
  },
  {
    image: u("photo-1561070791-2526d30994b5"),
    heading: "High-End UI/UX Design",
    description: "Product-grade interfaces your users and investors can take seriously.",
    overview:
      "From information architecture to high-fidelity UI, we design for clarity and conversion—not decoration. Deliverables plug straight into development with specs your team can build from.",
    services: [
      { title: "UX flows", description: "Journeys that match real tasks and edge cases." },
      { title: "Visual design", description: "Consistent systems, accessibility-minded." },
      { title: "Handoff", description: "Assets and notes for fast implementation." },
    ],
    openInModal: true,
  },
  {
    image: u("photo-1558494949-ef010cbdcc31"),
    heading: "Scalable Backend Architecture",
    description: "Node.js and cloud-ready foundations built to grow past the MVP.",
    overview:
      "APIs, data models, auth, and deployment patterns are chosen for maintainability and scale. You get production-minded structure—not a throwaway prototype backend.",
    services: [
      { title: "APIs & data layer", description: "Clear contracts and migration-friendly schemas." },
      { title: "Auth & security", description: "Sessions, roles, and safe defaults." },
      { title: "Cloud ops", description: "Environments, logging, and deploy hooks." },
    ],
    openInModal: true,
  },
  {
    image: u("photo-1677442136019-21780ecad995"),
    heading: "AI Integration",
    description: "LLMs, automation, and agents when your product needs intelligent behavior.",
    overview:
      "We integrate AI where it creates real user value: assistants, classification, workflows, or tooling—with guardrails, observability, and cost-aware design.",
    services: [
      { title: "Use-case design", description: "Where AI helps vs. where classic code wins." },
      { title: "Model & prompt layer", description: "Tunable, testable integration." },
      { title: "Safety & monitoring", description: "Boundaries, logging, and fallbacks." },
    ],
    openInModal: true,
  },
  {
    image: u("photo-1512941937669-90a1b58e7e9d"),
    heading: "Fully Functional MVP (Launch-ready)",
    description: "End-to-end product behavior—not a slide deck or static mock.",
    overview:
      "Your MVP is built for real users: core flows work, data persists, and the experience holds up in demos and early adoption. We focus on the path to launch, not shelf-ware.",
    services: [
      { title: "Core user journeys", description: "Happy path plus critical edge cases." },
      { title: "Quality bar", description: "Testing on the flows that matter for go-live." },
      { title: "Launch checklist", description: "Readiness for traffic and feedback." },
    ],
    openInModal: true,
  },
  {
    image: u("photo-1451187580459-43490279c0fa"),
    heading: "Deployment, Testing & Go-Live Support",
    description: "Ship to production with monitoring, handover, and a path to Phase 2.",
    overview:
      "We support cutover to production, stabilization, and knowledge transfer so your team owns the roadmap after launch. Optional ongoing support keeps momentum.",
    services: [
      { title: "Release & rollback", description: "Controlled deploys and recovery paths." },
      { title: "Handover", description: "Docs, access, and walkthroughs for your team." },
      { title: "Post-launch", description: "Triage, fixes, and roadmap for what’s next." },
    ],
    openInModal: true,
  },
]

export const EXPECTED_SERVICE_CARD_HEADINGS = cards.map((c) => c.heading)

export function buildServicesCardsSectionContent(): Record<string, unknown> {
  const defaults = getDefaultSectionContent("cards") as Record<string, unknown>
  return {
    ...defaults,
    title: "What we deliver",
    subText:
      "Full-stack delivery aligned with your Enterprise MVP: strategy, design, engineering, AI, launch, and handover—in one accountable team.",
    cardsPerRow: 3,
    cards,
  }
}

export function buildCustomPostTypeSectionContent(customTypeId: string): Record<string, unknown> {
  const defaults = getDefaultSectionContent("customPostType") as Record<string, unknown>
  return {
    ...defaults,
    customTypeId,
    itemsToShow: SERVICES_ITEMS_TO_SHOW,
    viewMoreMode: "default",
    viewMoreLink: "",
  }
}

export function buildCustomTypeCreateBody() {
  return {
    slug: SERVICES_CPT_SLUG,
    name: SERVICES_CPT_NAME,
    showInHeader: true,
    showInFooter: true,
    showCardsInNav: true,
    isPublished: true,
    order: 10,
    bannerTitle: SERVICES_CPT_NAME,
    bannerText:
      "Strategy, design, backend, AI, MVP build, and go-live—structured for speed without sacrificing quality.",
  }
}
