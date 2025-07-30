import React from "react";
import { Header } from "./(root)/_components/Header";
import { Footer } from "./(root)/_components/Footer";

const page = () => {
	return (
		<div>
			<Header />
			<div className="flex items-center justify-center min-h-[85vh]">
				<h1 className="text-4xl font-bold">
					You are not authorized...
				</h1>
			</div>
			<Footer />
		</div>
	);
};

export default page;
