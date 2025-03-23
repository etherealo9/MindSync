import * as React from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Bell,
  Bot,
  Book,
  BookOpen,
  Brain,
  Award,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleUser,
  Clock,
  Command,
  CreditCard,
  Database,
  File,
  FileText,
  Flame,
  Frown,
  Github,
  Heart,
  HelpCircle,
  Home,
  Image,
  Laptop,
  Lightbulb,
  Loader2,
  ListTodo,
  Meh,
  MessageCircle,
  MessageSquare,
  MessageSquarePlus,
  Moon,
  MoreHorizontal,
  Pencil,
  PenLine,
  Plus,
  PlusCircle,
  Rocket,
  RotateCw,
  Settings,
  Smile,
  Sparkles,
  SquarePen,
  Star,
  SunMedium,
  Trash,
  User,
  X,
  Zap,
  type LucideProps
} from "lucide-react";

export type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  // Basic icons
  logo: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      fill="none"
      {...props}
    >
      <path d="M12 2L2 7L12 12L22 7L12 2Z" />
      <path d="M2 17L12 22L22 17" />
      <path d="M2 12L12 17L22 12" />
      <path 
        className="fill-accent" 
        d="M12 11L7 8L12 5L17 8L12 11Z" 
        stroke="currentColor"
      />
    </svg>
  ),
  close: X,
  bot: Bot,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  trash: Trash,
  settings: Settings,
  billing: CreditCard,
  database: Database,
  ellipsis: MoreHorizontal,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  help: HelpCircle,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  create: PlusCircle,
  home: Home,
  edit: Pencil,
  message: MessageSquare,
  bell: Bell,
  clock: Clock,
  menu: Command,
  activity: Activity,
  check: Check,
  file: File,
  fileText: FileText,
  image: Image,
  
  // Custom icons for app features
  book: Book,
  bookOpen: BookOpen,
  calendar: Calendar,
  brain: Brain,
  award: Award,
  star: Star,
  zap: Zap,
  heart: Heart,
  messageCircle: MessageCircle,
  sparkles: Sparkles,
  todo: ListTodo,
  pen: PenLine,
  refresh: RotateCw,
  happy: Smile,
  sad: Frown,
  neutral: Meh,
  profile: CircleUser,
  idea: Lightbulb,
  fire: Flame,
  rocket: Rocket,
  chat: MessageSquarePlus,
  github: Github,
  journal: SquarePen,
  
  // Custom SVG icons
  pizza: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22v-5" />
      <path d="m4.21 10.42 1.33-1.33c.7-.7 1.3-1.77 1.3-2.65 0-1.81 1.46-3.24 3.28-3.24.66 0 1.29.2 1.79.57h.03c.14.1.33.18.48.38.15.2.3.48.46.71l.69 1.02c.11.16.22.32.36.46.3.3.69.5 1.11.5 1.37 0 2.5 1.13 2.5 2.5a2.5 2.5 0 0 1-2.5 2.5c-.82 0-1.54-.4-2-1.0" />
      <path d="m15.56 3.31-1.34.35m-8.67 8.17L2 15.8c-.4.4-.4 1 0 1.4l4.2 4.2c.4.4 1 .4 1.4 0l3.97-3.53" />
      <path d="M11 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      <path d="M15.5 9.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z" />
      <path d="M17 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
    </svg>
  ),
  
  // Task organization icon
  organize: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 12L11 14L15 10" />
      <line x1="3" y1="9" x2="21" y2="9" />
    </svg>
  ),
  
  // Reflection/Retrospect icon
  reflect: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7V12L15 15" />
      <path d="M8 5.5A7 7 0 0 0 4 12" />
      <path d="M20 12A7 7 0 0 0 16 5.5" />
    </svg>
  ),
  
  // Custom journal icon
  journalIcon: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      {...props}
    >
      <path d="M4 4V20H20V4H4Z" />
      <path d="M4 4L4 20" />
      <path d="M8 8H16" />
      <path d="M8 12H16" />
      <path d="M8 16H12" />
    </svg>
  )
}; 