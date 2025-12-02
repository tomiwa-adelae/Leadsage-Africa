import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Spotlight() {
  return (
    <section className="py-16">
      <div className="container space-y-4">
        <Image
          src={"/assets/images/spotlight-img.jpg"}
          alt="Interior design"
          width={1000}
          height={1000}
          loading="lazy"
          className="aspect-video size-full object-cover rounded-md"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 md:mt-10">
          <h2 className="text-2xl md:text-3xl font-medium">
            Leadsage connects people to homes they love.
          </h2>
          <div className="space-y-4 mt-2.5">
            <p className="text-base text-muted-foreground">
              We make it easy to search, compare, and secure rental properties
              across Nigeria. From verified listings to seamless payments,
              Leadsage is building a trusted housing ecosystem for tenants,
              landlords, and agents.
            </p>

            <Button asChild variant="secondary" size="md">
              <Link href="/listings">
                <span>Browse Listings</span>
                <ChevronRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
