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
  {
    slug: "/messages",
    label: "Messages",
  },
  {
    slug: "/wallet",
    label: "My wallet",
  },
];

export const DEFAULT_PROFILE_PICTURE = "/assets/images/profile-img.jpg";

export const DEFAULT_LISTING_IMAGE = "/assets/images/sample-listing.png";

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
    icon: "/assets/icons/draft.svg",
    name: "Draft",
    description:
      "Your listing is still in progress and not visible to the public. Use this while you're setting things up. You can continue editing anytime.”",
  },
  {
    id: uuidv4(),
    icon: "/assets/icons/publish.svg",
    name: "Published",
    description:
      "Your listing is submitted and pending approval. Once approved by Leadsage, it will become visible to renters. You can still make changes if needed.",
  },
  {
    id: uuidv4(),
    icon: "/assets/icons/archive.svg",
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
      slug: "/notifications",
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
      slug: "/notifications",
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
