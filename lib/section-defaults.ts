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
      return {
        backgroundColor: "#f3f4f6",
        paddingPercent: 5,
        title: "Project Delivery Life Cycle",
        description:
          "A transparent, structured approach to bringing your ideas to life. Each phase ensures quality, communication, and successful project delivery from concept to completion.",
        hint: "Use arrow buttons, scroll horizontally, or drag to explore all phases.",
        phases: [
          {
            number: "01",
            title: "Requirements Gathering",
            description: "Initial discovery and planning with the client.",
            color: "blue",
            icon: "document",
            items: [
              { heading: "Client Meeting", bullets: ["Schedule call", "Discuss goals and expectations", "Identify primary features"] },
              { heading: "Requirement Document", bullets: ["Write feature specs", "Organize by modules or flows", "Share document with client"] },
              { heading: "Finalization", bullets: ["Confirm features", "Lock scope"] },
            ],
          },
          {
            number: "02",
            title: "Estimation & Planning",
            description: "Define timelines and delivery milestones.",
            color: "green",
            icon: "chart",
            items: [
              { heading: "Time & Resource Estimates", bullets: ["Evaluate design/dev/test effort", "Define demo and delivery cycles"] },
              { heading: "Sprint Planning", bullets: ["Divide tasks into bi-weekly sprints", "Assign internal resources"] },
              { heading: "Timeline & Roadmap", bullets: ["Create shared timeline sheet", "Build internal Kanban/project tracker"] },
            ],
          },
          {
            number: "03",
            title: "Prototyping (if needed)",
            description: "Design skeleton UI or clickable prototype.",
            color: "purple",
            icon: "gear",
            items: [
              { heading: "Wireframes", bullets: ["Sketch low-fidelity layout", "Present basic flow"] },
              { heading: "Interactive Prototypes", bullets: ["Use Figma or similar tool", "Link flows and screens"] },
              { heading: "Feedback & Approval", bullets: ["Present to client", "Revise based on input", "Lock final designs"] },
            ],
          },
          {
            number: "04",
            title: "Tech Setup & Development",
            description: "Start coding and infrastructure setup.",
            color: "orange",
            icon: "cog",
            items: [
              { heading: "Project Initialization", bullets: ["Set up GitHub repo", "Configure CI/CD and servers"] },
              { heading: "Bi-weekly Sync", bullets: ["Schedule regular progress demos", "Gather and apply feedback"] },
              { heading: "Task Management", bullets: ["Track with internal board (e.g., Notion, Trello)", "Share updates with client"] },
            ],
          },
          {
            number: "05",
            title: "Testing & QA",
            description: "Ensure product is bug-free and secure.",
            color: "green",
            icon: "check",
            items: [
              { heading: "Manual Testing", bullets: ["Check UX flows, responsiveness", "Cross-browser and device testing"] },
              { heading: "Bug Fixes", bullets: ["Log and prioritize issues", "Patch critical blockers"] },
              { heading: "Security Checks", bullets: ["Sanitize inputs", "SSL and auth layer verification"] },
              { heading: "Final Walkthrough", bullets: [] },
            ],
          },
          {
            number: "06",
            title: "Take the Product Live!",
            description: "Launch the project to production.",
            color: "red",
            icon: "rocket",
            items: [
              { heading: "Deployment", bullets: ["Push to production (AWS, Vercel, etc.)", "Configure backups and monitoring"] },
              { heading: "Domain & SSL", bullets: ["Setup custom domain", "Apply SSL certs and CDN"] },
              { heading: "Launch Plan", bullets: ["Choose soft launch or full rollout", "Monitor performance in real-time"] },
            ],
          },
          {
            number: "07",
            title: "Handover / Client Training",
            description: "Deliver project assets and training.",
            color: "blue",
            icon: "graduation",
            items: [
              { heading: "Access Delivery", bullets: ["Provide admin accounts", "Share hosting credentials"] },
              { heading: "Documentation", bullets: ["User guides", "Codebase overview (if needed)"] },
              { heading: "Training", bullets: ["Screen recordings", "Live walkthrough sessions"] },
            ],
          },
          {
            number: "08",
            title: "Post-Launch Support",
            description: "Continued support and future planning.",
            color: "grey",
            icon: "wrench",
            items: [
              { heading: "Maintenance", bullets: ["Bug fixes", "Platform updates"] },
              { heading: "Feedback Collection", bullets: ["Monitor user input", "Prioritize suggestions"] },
              { heading: "Future Roadmap", bullets: ["Define Phase 2", "Scope enhancements"] },
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
