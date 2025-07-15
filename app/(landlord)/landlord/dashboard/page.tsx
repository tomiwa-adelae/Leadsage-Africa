import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { SiteHeader } from "@/components/sidebar/site-header";

const page = () => {
	return (
		<div>
			<SiteHeader />
			<div className="py-4 md:py-6 px-4 lg:px-6">
				<SectionCards />
				<ChartAreaInteractive />
			</div>
			{/* <DataTable data={data} /> */}
		</div>
	);
};

export default page;
