import { v4 as uuidv4 } from "uuid";
import {
  ClipboardList,
  FolderPlus,
  Info,
  LayoutDashboardIcon,
  LayoutList,
  MessageSquareMore,
  Settings,
  Wallet,
  House,
  Search,
  Heart,
  Bell,
  User,
  Shield,
  Hand,
  CreditCard,
  SunMoon,
  Mail,
  Plus,
  Hourglass,
  CircleCheck,
  CircleCheckBig,
  Archive,
} from "lucide-react";
import {
  IconArchive,
  IconBan,
  IconCalendarCheck,
  IconCalendarX,
  IconChartArcs,
  IconChartDots,
  IconChartHistogram,
  IconCheckbox,
  IconClipboardList,
  IconCoins,
  IconCurrencyNaira,
  IconFolder,
  IconMoneybag,
  IconReceipt,
  IconTrash,
  IconTrendingUp,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";

export const homeStats = [
  {
    number: 20,
    suffix: "+",
    title: "Total houses",
  },
  {
    number: 50,
    suffix: "+",
    title: "listings",
  },
  {
    number: 3,
    suffix: "+",
    title: "Estates",
  },
  {
    number: 10,
    suffix: "+",
    title: "Completed projects",
  },
];

export const navLinks = [
  {
    slug: "/",
    label: "Home",
  },
  {
    slug: "/listings",
    label: "Our listings",
  },
  {
    slug: "/about",
    label: "About us",
  },
  {
    slug: "/contact",
    label: "Contact us",
  },
];

export const DEFAULT_PROFILE_PICTURE = "/assets/images/profile-img.jpg";

export const DEFAULT_LISTING_IMAGE =
  "data:image/png;base64,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";

export const testimonials = [
  {
    image: "/assets/images/tomiwa-adelae.JPG",
    testimony:
      "Leadsage made renting so effortless! I found the perfect apartment in a week and the process was so smooth.",
    name: "Tomiwa Adelae",
    portfolio: "Renter",
  },
  {
    image: "/assets/images/israel-ibitoye.jpg",
    testimony:
      "Listing my property was seamless. I got verified renters in just days!",
    name: "Israel Ibitoye",
    portfolio: "Renter",
  },
];

export const onboardingRole = [
  {
    icon: House,
    title: "I’m a Landlord",
    description: "I want to list apartments or properties.",
    role: "landlord",
  },
  {
    icon: Search,
    title: "I’m a Renter",
    description: "I want to browse and book available apartments.",
    role: "renter",
  },
];

export const genders = ["Male", "Female"] as const;
export const countries = ["Nigeria"] as const;
export const states = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT (Abuja)",
] as const;

export const listingCategories = [
  {
    id: uuidv4(),
    icon: "/assets/icons/house.svg",
    name: "Apartment",
    description: "Self-contained units in a building",
  },
  {
    id: uuidv4(),
    icon: "/assets/icons/duplex.svg",
    name: "Duplex",
    description: "Two connected housing units",
  },
  {
    id: uuidv4(),
    icon: "/assets/icons/bungalow.svg",
    name: "Bungalow",
    description: "Single-story detached home",
  },
  {
    id: uuidv4(),
    icon: "/assets/icons/office.svg",
    name: "Office Space",
    description: "Ideal for business or commercial use",
  },
  {
    id: uuidv4(),
    icon: "/assets/icons/hotel.svg",
    name: "Hotel Room",
    description: "Short-term, hospitality-style rentals",
  },
  {
    id: uuidv4(),
    icon: "/assets/icons/studio.svg",
    name: "Studio",
    description: "One-room living space",
  },
];

export const listingAmenities = [
  {
    id: uuidv4(),
    icon: "/assets/icons/air-conditioning.svg",
    name: "Air conditioning",
    description: "Keeps the property cool and comfortable during hot weather.",
  },
  {
    id: uuidv4(),
    icon: "/assets/icons/heating.svg",
    name: "Heating",
    description: "Provides warmth during colder months.",
  },
  {
    id: uuidv4(),
    icon: "/assets/icons/wifi.svg",
    name: "Wifi",
    description: "One-room living space",
  },
  {
    id: uuidv4(),
    icon: "/assets/icons/television.svg",
    name: "Television",
    description:
      "Includes a TV in the living space or bedrooms for entertainment.",
  },
  {
    id: uuidv4(),
    icon: "/assets/icons/laundry.svg",
    name: "Laundry",
    description:
      "In-unit or shared laundry facilities available for tenant use.",
  },
  {
    id: uuidv4(),
    icon: "/assets/icons/refrigerator.svg",
    name: "Refrigerator",
    description: "Cold storage space for food and beverages.",
  },
  {
    id: uuidv4(),
    icon: "/assets/icons/microwave.svg",
    name: "Microwave",
    description: "	A microwave oven available for quick and easy meals.",
  },
  {
    id: uuidv4(),
    icon: "/assets/icons/oven.svg",
    name: "Oven",
    description: "Equipment for baking and cooking meals.",
  },
];

export const listingVisibilities = [
  {
    id: uuidv4(),
    icon: IconFolder,
    name: "Draft",
    description:
      "Your listing is still in progress and not visible to the public. Use this while you're setting things up. You can continue editing anytime.",
  },
  {
    id: uuidv4(),
    icon: CircleCheckBig,
    name: "Published",
    description:
      "Your listing is submitted and pending approval. Once approved by Leadsage, it will become visible to renters. You can still make changes if needed.",
  },
  {
    id: uuidv4(),
    icon: Archive,
    name: "Archived",
    description:
      "Your listing is no longer active and is hidden from renters. Use this when the space is no longer available. You can restore or edit it later if needed.",
  },
];

export const TOUR_GRACE_PERIOD_DAYS = 3; // or 3

export const bathrooms = ["1", "2", "3", "4"];

export const landlordNavLinks = {
  navMain: [
    {
      title: "Dashboard",
      slug: "/landlord/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "My listings",
      slug: "/landlord/listings",
      icon: LayoutList,
    },
    {
      title: "Create new listing",
      slug: "/landlord/listings/new",
      icon: FolderPlus,
    },
    {
      title: "Booking Requests",
      slug: "/landlord/bookings",
      icon: ClipboardList,
    },
    {
      title: "Messages",
      slug: "/landlord/messages",
      icon: MessageSquareMore,
    },
    {
      title: "Earnings",
      slug: "/landlord/earnings",
      icon: Wallet,
    },
    {
      title: "Notifications",
      slug: "/landlord/notifications",
      icon: Bell,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      slug: "/landlord/settings",
      icon: Settings,
    },
    {
      title: "Get Help",
      slug: "/help-center",
      icon: Info,
    },
  ],
};

export const adminNavLinks = {
  navMain: [
    {
      title: "Dashboard",
      slug: "/admin/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Users",
      icon: IconUsersGroup,
      group: true,
      items: [
        {
          title: "All Users",
          slug: "/admin/users",
          icon: IconUsersGroup,
        },
        {
          title: "Landlords",
          slug: "/admin/users/landlords",
          icon: IconUsers,
        },
        {
          title: "Customers",
          slug: "/admin/users/customers",
          icon: IconUsers,
        },
      ],
    },
    {
      title: "Listings",
      icon: LayoutList,
      group: true,
      items: [
        {
          title: "All Listings",
          slug: "/admin/listings",
          icon: IconClipboardList,
        },
        {
          title: "Pending Listings",
          slug: "/admin/listings/pendings",
          icon: Hourglass,
        },
        {
          title: "Rejected Listings",
          slug: "/admin/listings/rejected",
          icon: IconBan,
        },
        {
          title: "Archived Listings",
          slug: "/admin/listings/archived",
          icon: IconArchive,
        },
        {
          title: "Deleted Listings",
          slug: "/admin/listings/deleted",
          icon: IconTrash,
        },
      ],
    },
    {
      title: "Bookings",
      icon: ClipboardList,
      group: true,
      items: [
        {
          title: "All Bookings",
          slug: "/admin/bookings",
          icon: IconClipboardList,
        },
        {
          title: "Pending Bookings",
          slug: "/admin/bookings/pendings",
          icon: Hourglass,
        },
        {
          title: "Completed Bookings",
          slug: "/admin/bookings/completed",
          icon: IconCalendarCheck,
        },
        {
          title: "Confirmed Bookings",
          slug: "/admin/bookings/confirmed",
          icon: IconCheckbox,
        },
        {
          title: "Cancelled Bookings",
          slug: "/admin/bookings/cancelled",
          icon: IconCalendarX,
        },
      ],
    },
    {
      title: "Payments & Transactions",
      icon: CreditCard,
      group: true,
      items: [
        {
          title: "All Payments",
          slug: "/admin/payments",
          icon: IconCurrencyNaira,
        },
        {
          title: "Invoices & Receipt",
          slug: "/admin/invoices",
          icon: IconReceipt,
        },
        {
          title: "Revenue Reports",
          slug: "/admin/revenue",
          icon: IconMoneybag,
        },
      ],
    },
    {
      title: "Reports & Analytics",
      icon: IconChartHistogram,
      group: true,
      items: [
        {
          title: "User growth",
          slug: "admin/analytics/users",
          icon: IconTrendingUp,
        },
        {
          title: "Listings stats",
          slug: "admin/analytics/listings",
          icon: IconChartDots,
        },
        {
          title: "Tour bookings trends",
          slug: "admin/analytics/tour-bookings",
          icon: IconChartArcs,
        },
        {
          title: "Revenue breakdown",
          slug: "admin/analytics/revenue-breakdown",
          icon: IconCoins,
        },
      ],
    },
    {
      title: "Notifications",
      slug: "/admin/notifications",
      icon: Bell,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      slug: "/landlord/settings",
      icon: Settings,
    },
    {
      title: "Get Help",
      slug: "/help-center",
      icon: Info,
    },
  ],
};

export const customerNavLinks = {
  navMain: [
    {
      title: "Dashboard",
      slug: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "My bookings",
      slug: "/bookings",
      icon: ClipboardList,
    },
    {
      title: "Saved Properties",
      slug: "/saved-properties",
      icon: Heart,
    },
    {
      title: "Messages",
      slug: "/messages",
      icon: MessageSquareMore,
    },
    {
      title: "Notifications",
      slug: "/notifications",
      icon: Bell,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      slug: "/settings",
      icon: Settings,
    },
    {
      title: "Get Help",
      slug: "/help-center",
      icon: Info,
    },
  ],
};

export const settingsNavLinks = {
  title: "Account settings",
  navMain: [
    {
      title: "Personal Information",
      slug: "/settings",
      icon: User,
    },
    {
      title: "Login & Security",
      slug: "/settings/login-and-security",
      icon: Shield,
    },
    // {
    //   title: "Privacy",
    //   slug: "/settings/privacy",
    //   icon: Hand,
    // },
    {
      title: "Notifications",
      slug: "/settings/notifications",
      icon: Bell,
    },
    {
      title: "Appearance",
      slug: "/settings/appearance",
      icon: SunMoon,
    },
    {
      title: "Billings & Payments",
      slug: "/settings/payments",
      icon: CreditCard,
    },
  ],
};

export const userDropdownLinks = [
  {
    slug: "/dashboard",
    label: "My Profile",
    icon: User,
  },
  {
    slug: "/bookings",
    label: "My Bookings",
    icon: ClipboardList,
  },
  {
    slug: "/messages",
    label: "Messages",
    icon: Mail,
  },
  {
    slug: "/saved-properties",
    label: "Saved Properties",
    icon: Heart,
  },
  {
    slug: "/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    slug: "/",
    label: "Become a Landlord",
    icon: House,
  },
];

export const landlordDropdownLinks = [
  {
    slug: "/dashboard",
    label: "My Profile",
    icon: User,
  },
  {
    slug: "/landlord/dashboard",
    label: "Landlord Dashbaord",
    icon: LayoutDashboardIcon,
  },
  {
    slug: "/landlord/listings",
    label: "My Lisitngs",
    icon: LayoutList,
  },
  {
    slug: "/landlord/listings/new",
    label: "Create Listing",
    icon: Plus,
  },
  {
    slug: "/landlord/bookings",
    label: "My appointments",
    icon: ClipboardList,
  },
  {
    slug: "/landlord/wallets",
    label: "Earnings",
    icon: Wallet,
  },
  {
    slug: "/messages",
    label: "Messages",
    icon: Mail,
  },
  {
    slug: "/bookings",
    label: "My Bookings",
    icon: ClipboardList,
  },
  {
    slug: "/saved-properties",
    label: "Saved Properties",
    icon: Heart,
  },
  {
    slug: "/notifications",
    label: "Notifications",
    icon: Bell,
  },
];

export const languages = [
  "Afrikaans",
  "Albanian",
  "Amharic",
  "Arabic",
  "Armenian",
  "Assamese",
  "Azerbaijani",
  "Basque",
  "Belarusian",
  "Bengali",
  "Bosnian",
  "Bulgarian",
  "Burmese",
  "Catalan",
  "Cebuano",
  "Chinese",
  "Corsican",
  "Croatian",
  "Czech",
  "Danish",
  "Dhivehi",
  "Dutch",
  "English",
  "Esperanto",
  "Estonian",
  "Fijian",
  "Filipino",
  "Finnish",
  "French",
  "Frisian",
  "Galician",
  "Georgian",
  "German",
  "Greek",
  "Gujarati",
  "Haitian Creole",
  "Hausa",
  "Hawaiian",
  "Hebrew",
  "Hindi",
  "Hmong",
  "Hungarian",
  "Icelandic",
  "Igbo",
  "Indonesian",
  "Irish",
  "Italian",
  "Japanese",
  "Javanese",
  "Kannada",
  "Kazakh",
  "Khmer",
  "Kinyarwanda",
  "Korean",
  "Kurdish",
  "Kyrgyz",
  "Lao",
  "Latin",
  "Latvian",
  "Lithuanian",
  "Luxembourgish",
  "Macedonian",
  "Malagasy",
  "Malay",
  "Malayalam",
  "Maltese",
  "Maori",
  "Marathi",
  "Mongolian",
  "Nepali",
  "Norwegian",
  "Nyanja",
  "Odia",
  "Pashto",
  "Persian",
  "Polish",
  "Portuguese",
  "Punjabi",
  "Quechua",
  "Romanian",
  "Russian",
  "Samoan",
  "Sanskrit",
  "Scots Gaelic",
  "Serbian",
  "Sesotho",
  "Shona",
  "Sindhi",
  "Sinhala",
  "Slovak",
  "Slovenian",
  "Somali",
  "Spanish",
  "Sundanese",
  "Swahili",
  "Swedish",
  "Tajik",
  "Tamil",
  "Tatar",
  "Telugu",
  "Thai",
  "Tigrinya",
  "Turkish",
  "Turkmen",
  "Ukrainian",
  "Urdu",
  "Uyghur",
  "Uzbek",
  "Vietnamese",
  "Welsh",
  "Xhosa",
  "Yiddish",
  "Yoruba",
  "Zulu",
] as const;

export interface Theme {
  id: string;
  name: string;
  bgColor: string;
  headerColor: string;
  accentColor: string;
  buttonColors: string[];
}

export const themes: Theme[] = [
  {
    id: "light",
    name: "Light",
    bgColor: "bg-accent dark:bg-white",
    headerColor: "bg-white dark:bg-accent/10",
    accentColor: "bg-primary",
    buttonColors: ["bg-primary", "bg-red-500"],
  },
  {
    id: "dark",
    name: "Dark",
    bgColor: "bg-gray-800",
    headerColor: "bg-gray-700",
    accentColor: "bg-primary",
    buttonColors: ["bg-white", "bg-red-500"],
  },
  {
    id: "system",
    name: "Default device",
    bgColor: "split",
    headerColor: "bg-gray-700",
    accentColor: "bg-primary",
    buttonColors: ["bg-white", "bg-red-500"],
  },
];

export const uninterestedReasons = [
  "Price is too high",
  "Location doesn’t work for me",
  "Property doesn’t meet my needs (size, amenities, etc.)",
  "Listing feels incomplete or unclear",
  "Scheduling/touring issues",
  "Others",
] as const;
