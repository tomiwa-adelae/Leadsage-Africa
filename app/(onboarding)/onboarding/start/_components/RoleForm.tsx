"use client";
import { Button } from "@/components/ui/button";
import { onboardingRole } from "@/constants";
import { tryCatch } from "@/hooks/use-try-catch";
import { cn } from "@/lib/utils";
import { House } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { selectRole } from "../actions";
import { Loader } from "@/components/Loader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const RoleForm = () => {
	const router = useRouter();
	const [selectedRole, setSelectedRole] = useState<string>("");

	const [pending, startTransition] = useTransition();

	const onSubmit = async () => {
		startTransition(async () => {
			const { data: result, error } = await tryCatch(
				selectRole(selectedRole)
			);

			if (error) {
				toast.error("Oops! Internal server error");
				return;
			}

			if (result.status === "success") {
				toast.success(result.message);
				router.push("/onboarding/profile");
			} else {
				toast.error(result.message);
			}
		});
	};

	return (
		<div className="mt-8">
			<div className="grid gap-6">
				{onboardingRole.map(({ role, title, icon, description }) => {
					const Icon = icon;
					return (
						<div
							key={role}
							onClick={() => setSelectedRole(role)}
							className={cn(
								"border hover:bg-[#F7F7F7] transition-all cursor-pointer border-border p-4 rounded-lg flex items-center justify-start gap-2",
								selectedRole === role &&
									"border-primary bg-primary/10"
							)}
						>
							<div className="rounded-full inline-block bg-primary/10 text-primary p-4">
								<Icon className="size-6" />
							</div>
							<div>
								<h5 className="font-medium text-lg">{title}</h5>
								<p className="text-base text-muted-foreground">
									{description}
								</p>
							</div>
						</div>
					);
				})}
			</div>
			<div className="grid mt-8 grid-cols-2 gap-4">
				<Button className="w-full" asChild variant={"outline"}>
					<Link href="/">Skip</Link>
				</Button>
				<Button
					onClick={onSubmit}
					disabled={pending}
					className="w-full"
				>
					{pending ? <Loader text="Saving..." /> : "Next"}
				</Button>
			</div>
		</div>
	);
};
