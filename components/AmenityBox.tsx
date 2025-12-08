import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  name: string;
  icon: string;
  description?: string | null;
}

export const AmenityBox = ({ icon, name, description }: Props) => {
  return (
    <Collapsible
      className={cn(
        "border-b border-border px-4 hover:rounded-md last:border-b-0 hover:bg-muted transition-all"
      )}
    >
      <CollapsibleTrigger className="py-4 flex text-sm md:text-base items-center justify-start gap-2 w-full cursor-pointer">
        <div className="p-3 md:p-4 inline-block bg-primary/20 dark:bg-primary/70 text-primary dark:text-white rounded-full">
          <Image
            src={icon}
            alt={name}
            width={1000}
            height={1000}
            className="size-4 md:size-6 dark:invert"
          />
        </div>
        {name}
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4 text-xs md:text-base text-muted-foreground">
        {description}
      </CollapsibleContent>
    </Collapsible>
  );
};
