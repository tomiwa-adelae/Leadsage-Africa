import Head from "next/head";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "yet-another-react-lightbox/styles.css";

const dmsans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

import type { Metadata } from "next";
import { env } from "@/lib/env";
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
      <Head>
        <meta property="og:image" content="/opengraph.png" />
        <meta property="og:image" content="/assets/images/opengraph.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
        <meta
          data-n-head="ssr"
          data-hid="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1"
        />
      </Head>
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
