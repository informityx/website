/**
 * AI Capabilities CPT + cards from docs/inforMityx.ai.pdf Section 4: AI Capabilities /
 * Advanced Expertise. Used by scripts/add-home-ai-capabilities-cpt.ts.
 */

import type { CardItem } from "../types/cms"
import { getDefaultSectionContent } from "../lib/section-defaults"

const u = (photoPath: string) =>
  `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=1200&q=80`

export const AI_CAPABILITIES_CPT_SLUG = "ai-capabilities"
export const AI_CAPABILITIES_CPT_NAME = "AI Capabilities"
export const AI_ITEMS_TO_SHOW = 6
export const AI_CARDS_SECTION_ORDER = 0
/** After hero (0), MVP (1), services teaser (2) per PDF homepage outline. */
export const AI_HOME_SECTION_ORDER = 3

const cards: CardItem[] = [
  {
    image: u("photo-1677442136019-21780ecad995"),
    heading: "Agentic AI & Autonomous Workflows",
    description:
      "Goal-driven AI agents for complex, multi-step tasks—less manual work, smarter automation.",
    overview:
      "We build goal-driven AI agents capable of executing complex, multi-step tasks autonomously—reducing manual effort and enabling intelligent automation across your business.",
    services: [
      { title: "Task-based AI agents", description: "Focused automations for real workflows." },
      { title: "Multi-step orchestration", description: "Reliable chains across tools and data." },
      { title: "Autonomous decision systems", description: "Guardrailed autonomy where it helps." },
      { title: "AI-powered assistants", description: "Copilots aligned to your operations." },
    ],
    openInModal: true,
  },
  {
    image: u("photo-1620712943543-bcc4688e7485"),
    heading: "Generative AI & LLM-Powered Systems",
    description:
      "LLMs for content, automation, and conversational experiences—built for production.",
    overview:
      "We leverage cutting-edge large language models to build intelligent systems for content generation, automation, and conversational experiences.",
    services: [
      { title: "Conversational apps", description: "ChatGPT-class experiences on your data." },
      { title: "AI copilots", description: "Embedded help inside your products and ops." },
      { title: "Content generation", description: "Structured, brand-safe outputs at scale." },
      { title: "Knowledge assistants", description: "RAG and retrieval tuned to your corpus." },
    ],
    openInModal: true,
  },
  {
    image: u("photo-1551288049-bebda4e38f71"),
    heading: "Data Intelligence & Predictive Analytics",
    description:
      "Turn complex data into insight with analytics and models that speed up decisions.",
    overview:
      "Transform complex data into actionable insights using advanced analytics and predictive models that support smarter, faster decision-making.",
    services: [
      { title: "Predictive modeling", description: "Forecasts and scoring you can act on." },
      { title: "BI dashboards", description: "Role-ready views of KPIs and trends." },
      { title: "Data visualization", description: "Clarity for executives and operators." },
      { title: "Decision support", description: "Systems that surface options, not noise." },
    ],
    openInModal: true,
  },
  {
    image: u("photo-1507146426980-efd6c8363947"),
    heading: "Computer Vision & Image Intelligence",
    description:
      "Image and video AI for automation, monitoring, and recognition in real time.",
    overview:
      "We build AI systems that analyze images and videos in real time—enabling automation, monitoring, and intelligent recognition.",
    services: [
      { title: "Recognition systems", description: "Identity and access where appropriate." },
      { title: "Object detection & tracking", description: "Spatial understanding for workflows." },
      { title: "Video analytics", description: "Events, safety, and operations insights." },
      { title: "Quality inspection", description: "Defect and compliance checks at scale." },
    ],
    openInModal: true,
  },
  {
    image: u("photo-1531746797559-4f4b28ac5071"),
    heading: "Natural Language Processing & Conversational AI",
    description:
      "Machines that understand and respond—chatbots, sentiment, multilingual NLP.",
    overview:
      "Enable machines to understand, interpret, and respond to human language through intelligent NLP systems and conversational interfaces.",
    services: [
      { title: "Chatbots & assistants", description: "Omni-channel conversational UX." },
      { title: "Sentiment analysis", description: "Signals from reviews, tickets, and social." },
      { title: "Multilingual AI", description: "Consistent quality across languages." },
      { title: "Text analytics", description: "Classification, extraction, and search." },
    ],
    openInModal: true,
  },
  {
    image: u("photo-1581091226825-a6a2a5aee158"),
    heading: "Industrial IoT & Connected Intelligence",
    description:
      "Sensors, devices, and AI for monitoring, maintenance, and live operations.",
    overview:
      "We integrate sensors, devices, and AI systems to create intelligent, connected environments that optimize operations and enable real-time monitoring.",
    services: [
      { title: "Smart monitoring", description: "Unified visibility across assets and sites." },
      { title: "Predictive maintenance", description: "Reduce downtime with early signals." },
      { title: "IoT dashboards", description: "Operators see what matters, when it matters." },
      { title: "Real-time pipelines", description: "Ingest, process, and alert at the edge." },
    ],
    openInModal: true,
  },
]

export function buildAiCapabilitiesCardsSectionContent(): Record<string, unknown> {
  const defaults = getDefaultSectionContent("cards") as Record<string, unknown>
  return {
    ...defaults,
    title: "Deep AI expertise that drives real business outcomes",
    subText:
      "Beyond surface-level integration—intelligent systems that automate workflows, sharpen decisions, and scale measurable impact.",
    cardsPerRow: 3,
    cards,
  }
}

export function buildCustomPostTypeSectionContent(customTypeId: string): Record<string, unknown> {
  const defaults = getDefaultSectionContent("customPostType") as Record<string, unknown>
  return {
    ...defaults,
    customTypeId,
    itemsToShow: AI_ITEMS_TO_SHOW,
    viewMoreMode: "default",
    viewMoreLink: "",
  }
}

export function buildCustomTypeCreateBody() {
  return {
    slug: AI_CAPABILITIES_CPT_SLUG,
    name: AI_CAPABILITIES_CPT_NAME,
    showInHeader: false,
    showInFooter: true,
    showCardsInNav: true,
    isPublished: true,
    order: 11,
    bannerTitle: "AI Capabilities / Advanced Expertise",
    bannerText:
      "Agentic AI, LLMs, analytics, computer vision, NLP, and industrial IoT—designed for production and measurable outcomes.",
  }
}
