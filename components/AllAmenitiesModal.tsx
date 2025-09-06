import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { AmenityBox } from "./AmenityBox";

export function AllAmenitiesModal({
  amenities,
}: {
  amenities: {
    name: string;
    description: string | null;
    id: string;
    icon: string;
  }[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4" size="md" variant="outline">
          Show all {amenities?.length} amenities
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl sm:max-h-[min(640px,80vh)] max-h-[550px] flex flex-col gap-0 p-0  [&>button:last-child]:hidden">
        <ScrollArea className="flex max-h-full flex-col overflow-hidden">
          <DialogTitle className="p-4">
            <DialogClose asChild>
              <Button variant="ghost">
                <X />
              </Button>
            </DialogClose>
          </DialogTitle>
          <div className="px-4 grid grid-cols-1 pb-8">
            {amenities?.map((amenity) => (
              <AmenityBox
                key={amenity.id}
                icon={amenity.icon}
                name={amenity.name}
                description={amenity.description}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
