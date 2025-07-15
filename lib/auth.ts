import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "./db";
import { env } from "./env";
import { resend } from "./resend";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql", // or "mysql", "postgresql", ...etc
	}),
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url, token }, request) => {
			await resend.emails.send({
				from: "Leadsage Africa<onboarding@resend.dev>",
				to: user.email,
				subject: "Reset your password",
				html: `<p>Click the link to reset your password: <strong>${url}</strong>!</p>`,
			});
		},
	},
	socialProviders: {
		google: {
			clientId: env.AUTH_GOOGLE_CLIENT_ID,
			clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
		},
	},
	plugins: [admin()],
});
