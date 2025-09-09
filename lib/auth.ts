import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "./db";
import { env } from "./env";

import Mailjet from "node-mailjet";
import { passwordResetEmail } from "./emails/password-reset-email";
const mailjet = Mailjet.apiConnect(
  env.MAILJET_API_PUBLIC_KEY,
  env.MAILJET_API_PRIVATE_KEY
);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: env.SENDER_EMAIL_ADDRESS,
              Name: "Leadsage Africa",
            },
            To: [
              {
                Email: user.email,
                Name: user.name,
              },
            ],
            ReplyTo: {
              Email: env.SENDER_EMAIL_ADDRESS,
              Name: "Leadsage Support",
            },
            Subject: `Password Reset | Leadsage Africa.`,
            TextPart: `Reset your password with this link: ${url}`,
            HTMLPart: passwordResetEmail({
              name: user.name,
              resetLink: url,
            }),
          },
        ],
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
