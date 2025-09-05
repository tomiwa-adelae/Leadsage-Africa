import { AboutStats } from "../_components/AboutStats";
import { AboutSections } from "../_components/AboutSections";
import { AboutShowcase } from "../_components/AboutShowcase";
import { OurTeam } from "../_components/OurTeam";
import { Features } from "../_components/Features";
import { CTAs } from "../_components/CTAs";
import { PartneringCompanies } from "../_components/PartneringCompanies";

export default function AboutUs2() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.05]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 py-16">
        <AboutShowcase />
        <AboutStats />
        <AboutSections />
        <Features />
        <OurTeam />
        <div className="py-16">
          <PartneringCompanies />
        </div>
        <CTAs />
      </div>
    </section>
  );
}
