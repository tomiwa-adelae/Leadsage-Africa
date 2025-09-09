import { env } from "../env";

interface Props {
  name: string;
  resetLink: string;
}

export const passwordResetEmail = ({ name, resetLink }: Props) => `
    <!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Password Reset - Leadsage</title>
		<script src="https://cdn.tailwindcss.com"></script>
	</head>
	<body class="font-sans bg-gray-100 p-5">
		<div>
			<div>
				<h1 class="text-2xl font-semibold mb-2">🔑 Reset Your Password</h1>
				<p class="opacity-90 m-0">We received a request to reset your password</p>
			</div>

			<div class="p-10">
				<div class="text-lg text-gray-800 mb-5">
					Hi <span class="font-bold">${name}</span>,
				</div>

				<p class="mb-6 text-gray-700 leading-relaxed">
					We received a request to reset the password for your Leadsage account. 
					If you made this request, you can set a new password by clicking the button below.
				</p>

				<div class="text-center my-8">
					<a
						href="${resetLink}"
						class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-semibold mx-2 my-2 hover:bg-blue-700 hover:transform hover:-translate-y-0.5 transition-transform"
					>
						Reset Password
					</a>
				</div>

				<p class="mb-4 text-gray-700 leading-relaxed">
					This password reset link will expire in <span class="font-bold">1 hour</span> 
					for your security.
				</p>

				<p class="text-gray-700 leading-relaxed">
					If you didn’t request this, please ignore this email or contact our support team 
					immediately to secure your account.
				</p>

				<div class="bg-blue-50 p-5 rounded-lg my-6 text-center">
					<h4 class="font-semibold text-gray-800 mb-3">📞 Need Help?</h4>
					<p class="m-0">
						Email us at 
						<a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-600 font-semibold">
							${env.SUPPORT_EMAIL_ADDRESS}
						</a>
					</p>
					<p class="m-0">
						Or call 
						<a href="tel:${env.NEXT_PUBLIC_LEADSAGE_PHONE_NUMBER}" class="text-blue-600 font-semibold">
							${env.NEXT_PUBLIC_LEADSAGE_PHONE_NUMBER}
						</a>
					</p>
				</div>
			</div>

			<div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
				<p class="font-bold text-white mb-2">Leadsage Africa</p>
				<p class="m-0">
					Helping you find or list properties with ease across Nigeria.<br />
					For support, visit
					<a
						href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}"
						class="text-blue-400 hover:text-blue-300"
					>
						Leadsage Africa
					</a>
					or email
					<a
						href="mailto:${env.SUPPORT_EMAIL_ADDRESS}"
						class="text-blue-400 hover:text-blue-300"
					>
						${env.SUPPORT_EMAIL_ADDRESS}
					</a>
				</p>
			</div>
		</div>
	</body>
</html>
`;
