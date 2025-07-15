import React from "react";
import { RoleForm } from "./_components/RoleForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const page = () => {
	return (
		<div>
			<h1 className="text-3xl md:text-4xl font-semibold">
				Let's begin! Which of these best describe you?
			</h1>
			<RoleForm />
		</div>
	);
};

export default page;
