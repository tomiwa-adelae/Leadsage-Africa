import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "yet-another-react-lightbox/styles.css";

const dmsans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

import type { Metadata, Viewport } from "next";
import { env } from "@/lib/env";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Leadsage | Find Your Dream Home in Nigeria",
  description:
    "Discover verified rental properties and homes for sale in Nigeria. With Leadsage, searching, booking, and managing your next home is simple, fast, and secure.",
  openGraph: {
    images: "/assets/images/opengraph.png",
  },
  metadataBase: new URL(env.NEXT_PUBLIC_BETTER_AUTH_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmsans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
