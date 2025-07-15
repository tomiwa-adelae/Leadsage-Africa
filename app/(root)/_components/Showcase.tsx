"use client";
import CountUp from "react-countup";
import Image from "next/image";
import { ShowcaseSearchForm } from "./ShowcaseSearchForm";
import { homeStats } from "@/constants";
import { ShowcaseBoxes } from "./ShowcaseBoxes";

export const Showcase = () => {
	return (
		<div
			className="text-white bg-scroll bg-no-repeat bg-cover bg-left min-h-[80vh] relative"
			style={{
				backgroundImage: `url(/assets/images/primary-bg.png)`,
			}}
		>
			<main className="container py-20 grid grid-cols-1 lg:grid-cols-5 gap-14">
				<div className="col-span-3">
					<h1 className="font-medium text-4xl leading-snug md:text-5xl md:leading-snug">
						Find Your Perfect Home, Designed for You
					</h1>
					{/* <p className="hidden lg:block text-base text-gray-200 mt-4">
						Explore a diverse selection of properties that match
						your lifestyle and budget. Whether you're renting,
						buying, or investing, we help you find the ideal space
						with ease—saving you time, effort, and money along the
						way.
					</p> */}
					<ShowcaseSearchForm />
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
						{homeStats.map(({ number, title, suffix }, index) => (
							<div key={index} className="grid gap-1">
								<h3 className="font-medium text-3xl lg:text-4xl">
									<CountUp
										start={0}
										end={number}
										duration={2.25}
										decimal=","
										suffix={suffix}
									/>
								</h3>
								<p className="text-sm lg:text-base">{title}</p>
							</div>
						))}
					</div>
				</div>
				<div className="col-span-2 m-auto hidden md:block relative">
					<Image
						src={"/assets/images/showcase-display-img.png"}
						alt="Showcase Images"
						width={1000}
						height={1000}
						className="w-auto h-auto"
					/>
					<ShowcaseBoxes />
				</div>
			</main>
		</div>
	);
};
