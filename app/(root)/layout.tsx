import React, { ReactNode } from "react";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";

const layout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<Header />
			<div className="py-20">{children}</div>
			<Footer />
		</div>
	);
};

export default layout;
