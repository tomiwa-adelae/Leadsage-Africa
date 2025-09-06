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

interface Props {
  searchParams: any;
}

const page = async ({ searchParams }: Props) => {
  const { login } = await searchParams;

  if (login) {
    const user = await getUserInfo();

    if (!user.onboardingCompleted) redirect("/onboarding");
  }

  return (
    <div>
      <Showcase />
      <Categories />
      <PopularProperties />
      <Features />
      <Spotlight />
      <CTAs />
      <Testimonials />
      <PartneringCompanies />
      <SecondCTA />
    </div>
  );
};

export default page;
