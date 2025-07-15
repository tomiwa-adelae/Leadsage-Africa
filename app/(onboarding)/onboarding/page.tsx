import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import React from "react";

const page = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<div>
			<h1 className="text-3xl md:text-4xl font-semibold">
				Welcome to Leadsage, {session?.user.name.split(" ")[0]}
			</h1>
			<p className="text-muted-foreground text-base mt-1.5">
				Let’s set up your account so you can start making the most of
				your Leadsage experience.
			</p>
			<div className="grid mt-8 grid-cols-2 gap-4">
				<Button className="w-full" asChild variant={"outline"}>
					<Link href="/">Skip</Link>
				</Button>
				<Button className="w-full" asChild>
					<Link href="/onboarding/start">Next</Link>
				</Button>
			</div>
		</div>
	);
};

export default page;
