import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";

export const ListingTestimonial = () => {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-start gap-2">
				<Image
					alt={"user"}
					width={1000}
					height={1000}
					src={"/assets/images/tomiwa-adelae.JPG"}
					className="size-14 object-cover rounded-full"
				/>
				<div>
					<h4 className="font-medium text-lg">Emmy Walson</h4>
					<p className="text-muted-foreground text-sm">
						9 years on leadsage
					</p>
				</div>
			</div>
			<div className="flex items-center justify-start gap-2">
				<div className="flex items-center justify-start gap-0.5">
					<Star className="size-4" />
					<Star className="size-4" />
					<Star className="size-4" />
					<Star className="size-4" />
					<Star className="size-4" />
				</div>
				<span className="font-medium text-sm">May 2025</span>
			</div>
			<p className="line-clamp-3 text-base text-muted-foreground leading-relaxed">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim,
				non ipsa magnam maiores voluptate numquam nam possimus eum
				eligendi natus perferendis quibusdam debitis voluptatibus
				adipisci fugit consectetur iusto? Natus, odio.
			</p>
		</div>
	);
};
