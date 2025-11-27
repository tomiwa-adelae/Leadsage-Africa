import { env } from "../env";

interface Props {
  name: string;
  role: any;
}

export const onboardingSuccessEmail = ({ name, role }: Props) => `
    <!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Onboarding Success - Leadsage</title>
		<script src="https://cdn.tailwindcss.com"></script>
	</head>
	<body class="font-sans bg-gray-100 p-5">
		<div>
			<div>
				<h1 class="text-2xl font-medium mb-2">🎉 Onboarding Complete!</h1>
				<p class="opacity-90 m-0">Your Leadsage journey begins now</p>
			</div>

			<div class="p-10">
				<div class="text-lg text-gray-800 mb-5">
					Hi <span class="font-bold">${name}</span>,
				</div>

				<p class="mb-6 text-gray-700 leading-relaxed">
					Congratulations! You've successfully completed your onboarding process.
					Your account is now fully set up and ready to go.
				</p>

				<div class="bg-green-50 border-l-4 border-green-500 p-5 my-6 rounded-r-lg">
					<h3 class="text-lg font-medium text-gray-800 mb-4">✅ Next Steps</h3>
					<p class="text-gray-700 leading-relaxed">
						As a <span class="font-bold">${role}</span>, here’s what you can do next:
					</p>
					<ul class="list-disc list-inside mt-3 text-gray-700 space-y-2">
						${
              role === "renter"
                ? `
							<li>Browse verified rental listings across Nigeria</li>
							<li>Book property tours directly from your dashboard</li>
							<li>Save your favorite homes and get notified about new listings</li>
							`
                : `
							<li>List your property and reach potential renters fast</li>
							<li>Manage inquiries and tours from one place</li>
							<li>Track performance and stay updated on your listings</li>
							`
            }
					</ul>
				</div>

				<div class="text-center my-8">
					<a
						href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/${
  role === "renter" ? "dashboard" : "/landlord/dashboard"
}"
						class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium mx-2 my-2 hover:bg-blue-700 hover:transform hover:-translate-y-0.5 transition-transform"
					>
						Go to Dashboard
					</a>
					<a
						href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/${
  role === "renter" ? "listings" : "landlord/listings/new"
}"
						class="inline-block bg-gray-200 text-gray-800 py-3 px-8 rounded-full font-medium mx-2 my-2 hover:bg-gray-300 hover:transform hover:-translate-y-0.5 transition-transform"
					>
						${role === "renter" ? "Browse Properties" : "List Property"}
					</a>
				</div>

				<p class="mb-4 text-gray-700 leading-relaxed">
					We're excited to have you on board, <span class="font-bold">${name}</span>.
					If you need any help, our team is always ready to assist.
				</p>

				<div class="bg-blue-50 p-5 rounded-lg my-6 text-center">
					<h4 class="font-medium text-gray-800 mb-3">📞 Contact Support</h4>
					<p class="m-0">
						<span class="font-medium">Email us at:</span>
						<a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-600 font-medium">
							${env.SUPPORT_EMAIL_ADDRESS}
						</a>
					</p>
					<p class="m-0">
						Or call us:
						<a href="tel:${
              env.NEXT_PUBLIC_LEADSAGE_PHONE_NUMBER
            }" class="text-blue-600 font-medium">
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
