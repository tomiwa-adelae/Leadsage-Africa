import { redirect } from "next/navigation";
import { getUserInfo } from "../data/user/get-user-info";
import { PopularProperties } from "./_components/PopularProperties";
import { Showcase } from "./_components/Showcase";
import { Testimonials } from "@/components/Testimonials";
import { PartneringCompanies } from "./_components/PartneringCompanies";
import { Spotlight } from "./_components/Spotlight";
import { Features } from "./_components/Features";
import { CTAs } from "./_components/CTAs";
import { Categories } from "./_components/Categories";
import { SecondCTA } from "./_components/SecondCTA";

import type { Metadata } from "next";
import { Blogs } from "./_components/Blogs";
import { getApprovedListings } from "../data/listing/get-approved-listings";

export const metadata: Metadata = {
  title: "Leadsage | Find Your Dream Home in Nigeria",
  description:
    "Discover verified rental properties and homes for sale in Nigeria. With Leadsage, searching, booking, and managing your next home is simple, fast, and secure.",
};

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { login, query, tag, categorySlug, page } = await searchParams;

  if (login) {
    const user = await getUserInfo();

    if (!user.onboardingCompleted) redirect("/onboarding");
  }

  const listings = await getApprovedListings();

  return (
    <div>
      <Showcase listings={listings.listings.length} />
      <Categories />
      <PopularProperties />
      {/* <Features /> */}
      {/* <Spotlight /> */}
      <CTAs />
      <Testimonials />
      <Blogs />
      {/* <PartneringCompanies /> */}
      {/* <SecondCTA /> */}
    </div>
  );
};

export default page;
