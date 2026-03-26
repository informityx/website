import { icons as lucideIcons } from "lucide-react"

export type MobileMenuIconKey = string

const LEGACY_VALUE_TO_LUCIDE_ICON: Record<string, string> = {
  // Values from your previous small icon set.
  document: "FileText",
  chart: "ChartBar",
  gear: "Settings",
  cog: "Cog",
  check: "CircleCheck",
  rocket: "Rocket",
  graduation: "GraduationCap",
  wrench: "Wrench",
}

export const MOBILE_MENU_ICON_OPTIONS: Array<{
  value: MobileMenuIconKey
  label: string
}> = [
  // Legacy options (so previously saved values still display correctly)
  { value: "document", label: "Document" },
  { value: "chart", label: "Chart" },
  { value: "gear", label: "Gear" },
  { value: "cog", label: "Cog" },
  { value: "check", label: "Check" },
  { value: "rocket", label: "Rocket" },
  { value: "graduation", label: "Graduation" },
  { value: "wrench", label: "Wrench" },

  // Public-business-friendly icon catalog (50+)
  { value: "House", label: "Home" },
  { value: "Info", label: "About / Info" },
  { value: "BadgeInfo", label: "Info Badge" },
  { value: "BriefcaseBusiness", label: "Services" },
  { value: "Briefcase", label: "Work" },
  { value: "Building2", label: "Company" },
  { value: "Building", label: "Building" },
  { value: "Landmark", label: "Landmark" },
  { value: "Warehouse", label: "Warehouse" },

  { value: "Store", label: "Store" },
  { value: "ShoppingBag", label: "Products" },
  { value: "ShoppingCart", label: "Cart" },
  { value: "CreditCard", label: "Payments" },
  { value: "Banknote", label: "Money" },
  { value: "Ticket", label: "Deals" },
  { value: "Tags", label: "Tags" },
  { value: "Tag", label: "Tag" },
  { value: "Receipt", label: "Receipts" },

  { value: "MapPin", label: "Location" },
  { value: "Map", label: "Map" },
  { value: "Route", label: "Directions" },
  { value: "Compass", label: "Compass" },
  { value: "Pin", label: "Pin" },

  { value: "Phone", label: "Phone" },
  { value: "PhoneCall", label: "Call" },
  { value: "Mail", label: "Email" },
  { value: "MessageCircle", label: "Chat" },
  { value: "MessageSquare", label: "Message" },
  { value: "Send", label: "Send" },
  { value: "Headset", label: "Support" },
  { value: "LifeBuoy", label: "Help" },

  { value: "Clock", label: "Hours" },
  { value: "Calendar", label: "Calendar" },
  { value: "CalendarClock", label: "Appointments" },
  { value: "AlarmClock", label: "Schedule" },
  { value: "AlarmClockCheck", label: "Scheduled" },

  { value: "Users", label: "Team" },
  { value: "UserPlus", label: "Join" },
  { value: "User", label: "Account" },
  { value: "Group", label: "Group" },
  { value: "Accessibility", label: "Accessibility" },

  { value: "Search", label: "Search" },
  { value: "SlidersHorizontal", label: "Filters" },

  { value: "Sparkles", label: "Features" },
  { value: "Megaphone", label: "Marketing" },
  { value: "Star", label: "Testimonials" },
  { value: "Award", label: "Awards" },
  { value: "Trophy", label: "Trophy" },
  { value: "BadgeCheck", label: "Quality" },
  { value: "BadgeDollarSign", label: "Pricing" },

  { value: "Download", label: "Download" },
  { value: "Upload", label: "Upload" },
  { value: "Share2", label: "Share" },
  { value: "Share", label: "Share Link" },
  { value: "Link", label: "Links" },
  { value: "ExternalLink", label: "External Link" },

  { value: "GalleryHorizontal", label: "Gallery" },
  { value: "Image", label: "Image" },
  { value: "Images", label: "Images" },
  { value: "Video", label: "Video" },
  { value: "Film", label: "Film" },
  { value: "Play", label: "Play" },
  { value: "Camera", label: "Camera" },
  { value: "Mic", label: "Mic" },
  { value: "Music", label: "Music" },

  { value: "Newspaper", label: "Blog / News" },
  { value: "BookOpen", label: "Resources" },
  { value: "Book", label: "Library" },
  { value: "Globe", label: "Website / Global" },

  { value: "Shield", label: "Security" },
  { value: "ShieldCheck", label: "Protected" },
  { value: "Lock", label: "Lock" },
  { value: "Key", label: "Key" },

  { value: "Settings", label: "Settings" },
  { value: "Wrench", label: "Tools" },
  { value: "Toolbox", label: "Toolbox" },
  { value: "Cog", label: "Cog" },
  { value: "Rocket", label: "Launch" },
  { value: "GraduationCap", label: "Education" },

  { value: "FileText", label: "Document" },
  { value: "File", label: "File" },
  { value: "ChartArea", label: "Chart Area" },
  { value: "ChartBar", label: "Bar Chart" },
  { value: "ChartColumn", label: "Column Chart" },
  { value: "ChartPie", label: "Pie Chart" },
  { value: "ChartLine", label: "Line Chart" },
  { value: "ChartNetwork", label: "Network Chart" },
  { value: "ChartScatter", label: "Scatter Chart" },

  { value: "CalendarDays", label: "Days" },
  { value: "CalendarRange", label: "Range" },
  { value: "CalendarX", label: "Cancel" },
  { value: "CalendarCheck", label: "Confirmed" },
  { value: "CalendarMinus", label: "Minus" },
  { value: "CalendarPlus", label: "Plus" },

  { value: "CircleCheck", label: "Verified" },
  { value: "Check", label: "Check" },
  { value: "ThumbsUp", label: "Like" },
  { value: "ThumbsDown", label: "Dislike" },

  { value: "Clipboard", label: "Clipboard" },
  { value: "Copy", label: "Copy" },
  { value: "Printer", label: "Print" },
  { value: "Bookmark", label: "Bookmark" },
  { value: "BookmarkCheck", label: "Saved" },
]

export function MobileMenuIcon({
  icon,
  className,
}: {
  icon?: MobileMenuIconKey | null
  className?: string
}) {
  const storedValue = icon || "gear"
  const lucideKey = LEGACY_VALUE_TO_LUCIDE_ICON[storedValue] || storedValue

  const IconComponent = (lucideIcons as any)[lucideKey] || (lucideIcons as any).Settings
  if (!IconComponent) return null

  return <IconComponent className={className} aria-hidden />
}

