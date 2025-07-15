import Link from "next/link";
import Image from "next/image";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { formatMoneyInput } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const PopularProperties = async () => {
	return (
		<div className="container py-16">
			<div className="space-y-2">
				<h2 className="font-medium text-3xl md:text-4xl">
					Popular Properties
				</h2>
				<p className="hidden lg:block text-base text-muted-foreground leading-relaxed lg:max-w-lg">
					Check out our most viewed and top-selling properties—trusted
					by many for their quality, location, and value.
				</p>
			</div>
			<ScrollArea>
				<div className="flex w-max space-x-4 md:space-x-6 lg:space-x-8 pt-4 pr-10 pb-8">
					<Link
						href={`/listings/12345`}
						className="inline-block aspect-auto hover:bg-[#F7F7F7] transition-all w-[250px] md:w-[320px] lg:w-[400px] rounded-xl overflow-hidden cursor-pointer group"
					>
						<div className="overflow-hidden">
							<Image
								src={DEFAULT_LISTING_IMAGE}
								alt={"{Property image}"}
								width={1000}
								height={1000}
								className="group-hover:scale-[1.1] aspect-auto w-full rounded-xl object-cover transition ease-out"
							/>
						</div>
						<h4 className="mt-4 text-primary text-lg md:text-xl font-semibold hover:underline transition ease-in-out">
							Lekki Phase 1
						</h4>
						<p className="text-muted-foreground text-sm lg:text-base mt-1.5">
							Lagos, Nigeria
						</p>
						<p className="text-base font-medium mt-2">
							{formatMoneyInput(10000)}
						</p>
					</Link>
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
};
