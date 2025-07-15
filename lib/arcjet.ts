import arcjet, {
	detectBot,
	fixedWindow,
	protectSignup,
	sensitiveInfo,
	shield,
	slidingWindow,
} from "@arcjet/next";
import { env } from "./env";

export {
	detectBot,
	fixedWindow,
	shield,
	slidingWindow,
	sensitiveInfo,
	protectSignup,
};

export default arcjet({
	key: env.ARCJET_KEY,
	characteristics: ["fingerprint"],
	rules: [
		shield({
			mode: "LIVE",
		}),
	],
});
