import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "icon-library.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "leadsage.fly.storage.tigris.dev",
				port: "",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				port: "",
			},
		],
	},
};

export default nextConfig;
