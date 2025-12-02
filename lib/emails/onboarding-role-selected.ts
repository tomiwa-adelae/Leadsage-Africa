import { env } from "../env";

interface Props {
  name: string;
  role: string | any;
}

export const onboardingRoleSelected = ({ name, role }: Props) => `
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Welcome to Leadsage</title>
		<script src="https://cdn.tailwindcss.com"></script>
	</head>
	<body class="font-sans bg-gray-100 p-5">
		<div>
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-gray-800 mb-2">Onboarding Started 🎉</h1>
				<p class="text-gray-600">You’ve successfully set up your role</p>
			</div>

			<div class="p-10 bg-white shadow rounded-md">
				<div class="text-lg text-gray-800 mb-6">
					Hi <span class="font-bold">${name}</span>,
				</div>

				<p class="mb-6 text-gray-700 leading-relaxed">
					You’ve chosen to continue as a 
					<span class="font-bold">${role}</span> on <strong>Leadsage</strong>.  
					Here’s what that means for you:
				</p>

				<div class="bg-blue-50 border-l-4 border-blue-500 p-5 my-6 rounded-r-lg">
					<h3 class="text-lg font-medium text-gray-800 mb-4">🚀 Your Next Steps</h3>

					${
            role === "renter"
              ? `
						<ul class="list-disc list-inside space-y-2 text-gray-700">
							<li>Browse verified listings and save your favorites</li>
							<li>Book property tours with ease</li>
							<li>Apply directly for rentals online</li>
							<li>Track all your applications in one dashboard</li>
						</ul>
						`
              : `
						<ul class="list-disc list-inside space-y-2 text-gray-700">
							<li>List your property with verified details</li>
							<li>Receive and review tenant applications</li>
							<li>Manage leases and rental payments</li>
							<li>Connect with verified renters across Nigeria</li>
						</ul>
						`
          }
				</div>

				<div class="text-center my-8">
					<a
						href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/onboarding/profile"
						class="inline-block bg-primary-600 text-white py-3 px-8 rounded-full font-medium mx-2 my-2 hover:bg-primary-700 transition-colors"
					>
						Complete your onboarding
					</a>
					<a
						href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/${
  role === "landlord" ? "landlord/dashboard" : "dashboard"
}"
						class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium mx-2 my-2 hover:bg-blue-700 transition-colors"
					>
						Go to Dashboard
					</a>
				</div>

				<p class="text-gray-700 leading-relaxed mb-4">
					We’re excited to support your journey as a <span class="font-medium">${role}</span>.  
					If you have any questions, reach out to our team anytime at 
					<a href={mailto:${
            env.SUPPORT_EMAIL_ADDRESS
          }} class="text-blue-600 font-medium">${env.SUPPORT_EMAIL_ADDRESS}</a>.
				</p>

				<p class="text-gray-700">
					Let’s make housing simple and stress-free together 🚀
				</p>
			</div>

			<div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm mt-8">
				<p class="font-bold text-white mb-2">Leadsage Africa</p>
				<p class="m-0">
					You are receiving this email because you completed onboarding on Leadsage.<br />
					For support, visit
					<a
						href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}"
						class="text-blue-400 hover:text-blue-300"
					>Leadsage Africa</a>
					or call
					<a
						href="tel:${env.NEXT_PUBLIC_LEADSAGE_PHONE_NUMBER}"
						class="text-blue-400 hover:text-blue-300"
					>${env.NEXT_PUBLIC_LEADSAGE_PHONE_NUMBER}</a>
				</p>
			</div>
		</div>
	</body>
</html>
`;
