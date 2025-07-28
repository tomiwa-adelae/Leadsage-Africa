import React from "react";
import { SuccessComponents } from "./_components/SuccessComponents";

const page = () => {
	return (
		<div className="container py-8">
			<h1 className="text-3xl md:text-4xl font-semibold">
				You're all set!
			</h1>
			<p className="text-muted-foreground text-base mt-2.5">
				Your visit has been scheduled. We’ve sent the details to your
				email.
			</p>
			<SuccessComponents />
		</div>
	);
};

export default page;
