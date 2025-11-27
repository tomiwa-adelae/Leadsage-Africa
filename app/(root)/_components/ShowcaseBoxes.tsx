import { House, ShieldUser } from "lucide-react";
import Image from "next/image";

export const ShowcaseBoxes = () => {
  return (
    <div className="text-black">
      <div className="rounded-2xl bg-white p-4 inline-flex items-center justify-start gap-4 absolute top-[-8%] left-[20%] translate-x-[-20%] translate-y-[8%] animate-bounce">
        <div className="rounded-full p-3 bg-primary/20 inline-block text-primary">
          <House className="" />
        </div>
        <div className="space-y-1">
          <h5 className="font-medium text-sm">Proof of Quality</h5>
          <p className="text-xs text-muted-foreground">
            We prioritize excellence & reliability
          </p>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-4 inline-flex items-center justify-start gap-4 absolute top-[45%] right-[-5%] translate-x-[5%] translate-y-[-45%] animate-bounce">
        <div className="rounded-full p-3 bg-primary/20 inline-block text-primary">
          <ShieldUser />
        </div>
        <div className="space-y-1">
          <h5 className="font-medium text-sm">Safe and secure</h5>
          <p className="text-xs text-muted-foreground">
            Your privacy is our top concerns.
          </p>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-4 inline-flex items-center justify-start gap-4 absolute bottom-[-2%] left-[-10%] translate-x-[10%] translate-y-[2%] animate-bounce">
        <h3 className="font-medium text-sm">50+ Happy Customers</h3>
        <Image
          src={"/assets/images/people.webp"}
          alt={"Happy Customer"}
          width={1000}
          height={1000}
          className="w-auto h-auto"
        />
      </div>
    </div>
  );
};
