import { SectionData } from "@/types/cms"
import TextImageSection from "./TextImageSection"
import ImageSliderSection from "./ImageSliderSection"
import HeadingParagraphSection from "./HeadingParagraphSection"
import CardsSection from "./CardsSection"
import ProjectLifeCycleSection from "./ProjectLifeCycleSection"

interface SectionRendererProps {
  section: SectionData
  /** When set (e.g. custom type slug), cards with openInNewPage + cardSlug link to /basePath/cardSlug */
  basePath?: string
}

function SectionWrapper({
  content,
  children,
}: {
  content: Record<string, unknown>
  children: React.ReactNode
}) {
  const backgroundColor = content?.backgroundColor as string | undefined
  const paddingPercent = content?.paddingPercent as number | undefined
  const padding = paddingPercent != null ? `${paddingPercent}%` : "5%"

  return (
    <div
      className="w-screen relative left-1/2 -translate-x-1/2"
      style={{
        backgroundColor: backgroundColor || "transparent",
        paddingTop: padding,
        paddingBottom: padding,
        paddingLeft: padding,
        paddingRight: padding,
      }}
    >
      <div className="container mx-auto px-4">{children}</div>
    </div>
  )
}

function renderSection(section: SectionData, basePath?: string) {
  const content = (section.content || {}) as Record<string, unknown>
  switch (section.type) {
    case "textImage":
      return <TextImageSection content={section.content as any} />
    case "imageSlider":
      return <ImageSliderSection content={section.content as any} />
    case "headingParagraph":
      return <HeadingParagraphSection content={section.content as any} />
    case "cards":
      return <CardsSection content={section.content as any} basePath={basePath} />
    case "projectLifeCycle":
      return <ProjectLifeCycleSection content={section.content as any} />
    default:
      return (
        <div className="p-4 border border-yellow-300 bg-yellow-50 rounded">
          <p className="text-sm text-yellow-800">
            Unknown section type: {section.type}
          </p>
        </div>
      )
  }
}

export default function SectionRenderer({ section, basePath }: SectionRendererProps) {
  const content = (section.content || {}) as Record<string, unknown>
  return (
    <SectionWrapper content={content}>
      {renderSection(section, basePath)}
    </SectionWrapper>
  )
}
