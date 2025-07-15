import React from "react";
import { ResetPasswordForm } from "./_components/ResetPasswordForm";

const page = () => {
	return (
		<div>
			<h1 className="text-3xl md:text-4xl font-semibold">
				Reset your password
			</h1>
			<p className="text-muted-foreground text-base mt-1.5">
				For your security, please create a new password below. Make sure
				it’s something strong and unique.
			</p>
			<ResetPasswordForm />
		</div>
	);
};

export default page;
