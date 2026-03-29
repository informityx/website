/**
 * Default content for new sections by type. Shared by PageEditor and CustomTypeEditor.
 */
export function getDefaultSectionContent(type: string): Record<string, unknown> {
  switch (type) {
    case "hero":
      return {
        backgroundColor: "#020617",
        paddingPercent: 6,
        eyebrow: "",
        headline: "",
        subheadline: "",
        supportingLine: "",
        headlineTag: "h1",
        contentAlignment: "left",
        visualPosition: "right",
        primaryCtaText: "",
        primaryCtaLink: "",
        primaryCtaVisible: true,
        secondaryCtaText: "",
        secondaryCtaLink: "",
        secondaryCtaVisible: true,
        heroImage: "",
        heroImageAlt: "",
        accentColor: "#3b82f6",
        textColor: "#ffffff",
        subTextColor: "#cbd5e1",
      }
    case "textImage":
      return { backgroundColor: null, paddingPercent: 5, text: "", image: "", alignment: "left" }
    case "imageSlider":
      return { backgroundColor: null, paddingPercent: 5, images: [], autoplay: false }
    case "headingParagraph":
      return {
        backgroundColor: null,
        paddingPercent: 6,
        layout: "split",
        heading: "Launch Your Enterprise MVP in Just 40 Days",
        paragraphs: [],
        eyebrow: "High-Impact USP / Fast Delivery Section",
        subheadline:
          "Turn your idea into a fully functional, scalable product — built with the right architecture, clean code, and real-world usability from day one.",
        body: "We combine speed with engineering excellence to deliver MVPs that are not just quick prototypes — but solid, production-ready foundations. From product strategy and UI/UX to backend systems and AI integration, our team ensures your product is built to launch fast and scale seamlessly.",
        headlineTag: "h2",
        contentAlignment: "left",
        visualPosition: "right",
        primaryCtaText: "Start Your MVP",
        primaryCtaLink: "/contact",
        primaryCtaVisible: true,
        secondaryCtaText: "Discuss Your Idea",
        secondaryCtaLink: "/contact",
        secondaryCtaVisible: true,
        image: "",
        imageAlt: "Enterprise MVP delivery timeline and product development",
        accentColor: "#3b82f6",
        textColor: "#ffffff",
        subTextColor: "#cbd5e1",
        valuePoints: [
          "Product Strategy & Technical Planning",
          "High-End UI/UX Design",
          "Scalable Backend Architecture (Node.js / Cloud-ready)",
          "AI Integration (LLMs, Automation, Agents if required)",
          "Fully Functional MVP (Launch-ready)",
          "Deployment, Testing & Go-Live Support",
        ],
        trustPoints: [
          "Built for scalability — not throwaway MVPs",
          "Speed without compromising quality",
          "Designed for real users, not just demos",
          "Clear roadmap from MVP → Full Product",
        ],
        badgeText: "40 Days",
        showTimeline: true,
        timelineLabels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
      }
    case "cards":
      return { backgroundColor: null, paddingPercent: 5, title: "", subText: "", cardsPerRow: 3, cards: [] }
    case "projectLifeCycle":
      // Section 5 — How We Work (docs/inforMityx.ai.pdf)
      return {
        backgroundColor: "#f3f4f6",
        paddingPercent: 5,
        title: "From Idea to Scalable Product — Our Proven Process",
        description:
          "A structured, transparent, and fast-moving approach that ensures your product is built right — from concept to launch and beyond.",
        hint: "Hover or focus a card to flip and read the full details. Scroll horizontally to see all phases.",
        phases: [
          {
            number: "01",
            title: "Discovery & Strategy",
            tagline: "Understand Before We Build",
            description:
              "We align on your vision, define clear objectives, and identify the best technical approach to ensure your product solves the right problem.",
            color: "blue",
            icon: "document",
            items: [
              {
                heading: "Key Focus",
                bullets: [
                  "Business goals & requirements",
                  "Feature planning",
                  "Technical feasibility",
                  "Product roadmap",
                ],
              },
            ],
          },
          {
            number: "02",
            title: "Planning & Architecture",
            tagline: "Designing for Scale from Day One",
            description:
              "We architect your system with scalability, performance, and flexibility in mind — ensuring your product grows without limitations.",
            color: "green",
            icon: "chart",
            items: [
              {
                heading: "Key Focus",
                bullets: [
                  "System architecture design",
                  "Tech stack selection",
                  "Sprint planning",
                  "Infrastructure planning",
                ],
              },
            ],
          },
          {
            number: "03",
            title: "UI/UX & Prototyping",
            tagline: "Design That Users Actually Love",
            description:
              "We create intuitive, user-centric designs that are not only visually appealing but also optimized for usability and engagement.",
            color: "purple",
            icon: "gear",
            items: [
              {
                heading: "Key Focus",
                bullets: [
                  "Wireframes & user flows",
                  "Interactive prototypes",
                  "UX optimization",
                  "Feedback iterations",
                ],
              },
            ],
          },
          {
            number: "04",
            title: "Development",
            tagline: "Building the Core Product",
            description:
              "Our engineering team builds your product using clean, scalable code — integrating APIs, AI systems, and robust backend infrastructure.",
            color: "orange",
            icon: "cog",
            items: [
              {
                heading: "Key Focus",
                bullets: [
                  "Frontend & backend development",
                  "API integrations",
                  "AI implementation",
                  "DevOps & CI/CD",
                ],
              },
            ],
          },
          {
            number: "05",
            title: "Testing & Optimization",
            tagline: "Quality You Can Trust",
            description:
              "We rigorously test your product to ensure performance, security, and reliability before launch.",
            color: "red",
            icon: "check",
            items: [
              {
                heading: "Key Focus",
                bullets: [
                  "QA & bug fixing",
                  "Performance optimization",
                  "Security checks",
                  "Cross-platform testing",
                ],
              },
            ],
          },
          {
            number: "06",
            title: "Launch & Deployment",
            tagline: "Go Live with Confidence",
            description:
              "We handle deployment, infrastructure setup, and launch execution — ensuring everything runs smoothly in production.",
            color: "grey",
            icon: "rocket",
            items: [
              {
                heading: "Key Focus",
                bullets: [
                  "Cloud deployment (AWS/Vercel)",
                  "Domain & SSL setup",
                  "Monitoring systems",
                  "Launch strategy",
                ],
              },
            ],
          },
          {
            number: "07",
            title: "Handover & Training",
            tagline: "Empowering Your Team",
            description:
              "We provide documentation, walkthroughs, and training so your team can confidently manage and scale the product.",
            color: "blue",
            icon: "graduation",
            items: [
              {
                heading: "Key Focus",
                bullets: [
                  "Documentation",
                  "Admin access setup",
                  "Training sessions",
                  "Knowledge transfer",
                ],
              },
            ],
          },
          {
            number: "08",
            title: "Growth & Support",
            tagline: "Scale, Optimize, Evolve",
            description:
              "We continue to support and improve your product post-launch, helping you scale and adapt as your business grows.",
            color: "green",
            icon: "wrench",
            items: [
              {
                heading: "Key Focus",
                bullets: [
                  "Ongoing maintenance",
                  "Feature enhancements",
                  "Performance monitoring",
                  "Future roadmap",
                ],
              },
            ],
          },
        ],
      }
    case "customPostType":
      return {
        backgroundColor: null,
        paddingPercent: 5,
        customTypeId: "",
        itemsToShow: 3,
        viewMoreMode: "default",
        viewMoreLink: "",
      }
    default:
      return {}
  }
}
