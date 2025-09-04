import { redirect } from "next/navigation";
import { getUserInfo } from "../data/user/get-user-info";
import { PopularProperties } from "./_components/PopularProperties";
import { Showcase } from "./_components/Showcase";
import { Testimonials } from "@/components/Testimonials";

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
      <PopularProperties />
      <Testimonials />
      {/* <FindProperties /> */}
      {/* <PartneringCompanies /> */}
    </div>
  );
};

export default page;
