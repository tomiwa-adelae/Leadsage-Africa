import Link from "next/link";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const Logo = ({ invert = false }: { invert?: boolean }) => {
	return (
		<Link
			className={`flex items-center justify-start gap-2 hover:text-secondary transition-all`}
			href="/"
		>
			<Image
				src={"/assets/images/logo.png"}
				alt="Leadsage africa logo"
				width={1000}
				height={1000}
				className={cn(
					"w-[150px] md:w-[160px] object-cover dark:invert",
					invert && "invert dark:invert-0"
				)}
			/>
		</Link>
	);
};
