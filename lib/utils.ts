import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatMoneyInput = (inputValue: any) => {
  if (inputValue == null || isNaN(Number(inputValue))) return "0";

  let value = String(inputValue).replace(/[^0-9.]/g, "");
  let [whole, decimal] = value.split(".");
  whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal !== undefined ? `${whole}.${decimal}` : whole;
};

export const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    event.key === "e" ||
    event.key === "E" ||
    event.key === "-" ||
    event.key === "+"
  ) {
    event.preventDefault();
  }
};

export function removeCommas(value: any) {
  return value.replace(/,/g, "");
}

export function formatDate(dateString: string | any): string {
  const date = new Date(dateString);

  // Get the day, month and year
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Function to get the ordinal suffix
  const getOrdinalSuffix = (num: number): string => {
    const suffixes = ["th", "st", "nd", "rd"];
    const modulo100 = num % 100;
    const modulo10 = num % 10;
    const suffix =
      modulo10 <= 3 && modulo10 > 0 && modulo100 !== 11
        ? suffixes[modulo10]
        : suffixes[0];
    return `${num}${suffix}`;
  };

  // Format the date
  return `${month} ${getOrdinalSuffix(day)}, ${year}`;
}

export const formatDateInARow = (date: any) => {
  const formattedDate = new Date(date);
  const result = formatDistanceToNow(formattedDate, { addSuffix: true });

  return result;
};

export function formUrlQuery({ params, key, value }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key: any) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
}

// Define available time slots
export const AVAILABLE_TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

// Helper function to get date range (next 3 days only)
export function getBookingDateRange() {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() + 1); // Start from tomorrow

  const endDate = new Date(now);
  endDate.setDate(now.getDate() + 3); // End 3 days from now

  return { startDate, endDate };
}

// Helper function to format date as YYYY-MM-DD
export function formatDateForDB(date: Date): Date {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return new Date(`${year}-${month}-${day}`);
}

// Helper function to check if date is weekend
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

export function getGreeting(currentTime = new Date()) {
  const hour = currentTime.getHours();

  let timeGreeting;

  if (hour >= 5 && hour < 12) {
    timeGreeting = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    timeGreeting = "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    timeGreeting = "Good evening";
  } else {
    timeGreeting = "Good night";
  }

  return timeGreeting;
}
