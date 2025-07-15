"use client";
import { ImagesSlider } from "@/components/ui/images-slider";
import { testimonials } from "@/constants";
import { motion } from "motion/react";
import React, { useState } from "react";

export const Testimonials = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	// Extract only images for the slider
	const imageOnly = testimonials.map(({ image }) => ({ image }));

	return (
		<div className="hidden md:block lg:col-span-3">
			<ImagesSlider
				className="h-full min-h-screen"
				images={imageOnly}
				onIndexChange={setCurrentIndex}
			>
				{testimonials[currentIndex] && (
					<motion.div
						initial={{ opacity: 0, y: -80 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="z-50 container text-white flex absolute bottom-5 flex-col justify-end space-y-4 items-start"
					>
						<motion.h4 className="font-medium text-2xl lg:text-4xl">
							{testimonials[currentIndex].testimony}
						</motion.h4>
						<div>
							<h5 className="text-muted font-semibold text-lg">
								{testimonials[currentIndex].name}
							</h5>
							<p className="text-base text-gray-300">
								{testimonials[currentIndex].portfolio}
							</p>
						</div>
					</motion.div>
				)}
			</ImagesSlider>
		</div>
	);
};
