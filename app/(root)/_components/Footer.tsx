import { Separator } from "@/components/ui/separator";
import React from "react";

export const Footer = () => {
	return (
		<div className="py-6">
			<div className="container">
				<Separator className="mb-6" />
				<p className="text-sm text-muted-foreground">
					&copy; 2025 Leadsage Africa. All rights reserved
				</p>
			</div>
		</div>
	);
};
