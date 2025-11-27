import { env } from "../env";

interface Props {
  name: string;
}

export const accountCreationSuccess = ({ name }: Props) => `
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
				<h1 class="text-3xl font-bold text-gray-800 mb-2">Welcome to Leadsage 🎉</h1>
				<p class="text-gray-600">Your account has been created successfully</p>
			</div>

			<div class="p-10 bg-white shadow rounded-lg">
				<div class="text-lg text-gray-800 mb-6">
					Hi <span class="font-bold">${name}</span>,
				</div>

				<p class="mb-6 text-gray-700 leading-relaxed">
					We’re excited to have you on board! With your new Leadsage account, 
					you can now explore verified properties, save favorites, 
					and manage bookings all in one place.
				</p>

				<div class="bg-blue-50 border-l-4 border-blue-500 p-5 my-6 rounded-r-lg">
					<h3 class="text-lg font-medium text-gray-800 mb-4">🚀 What’s Next?</h3>
					<ul class="list-disc list-inside space-y-2 text-gray-700">
						<li>Browse verified property listings</li>
						<li>Save your dream homes</li>
						<li>Book tours and apply for rentals easily</li>
						<li>Stay updated with your dashboard</li>
					</ul>
				</div>

				<div class="text-center my-8">
					<a
						href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/dashboard"
						class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium mx-2 my-2 hover:bg-blue-700 transition-colors"
					>
						Go to Dashboard
					</a>
				</div>

				<p class="text-gray-700 leading-relaxed mb-4">
					Need help? Our support team is always here for you at 
					<a href={mailto:${env.SUPPORT_EMAIL_ADDRESS}} class="text-blue-600 font-medium">${env.SUPPORT_EMAIL_ADDRESS}</a>.
				</p>

				<p class="text-gray-700">
					Welcome aboard, and let’s help you find your dream home! 🏡
				</p>
			</div>

			<div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm mt-8">
				<p class="font-bold text-white mb-2">Leadsage Africa</p>
				<p class="m-0">
					You are receiving this email because you created an account on Leadsage.<br />
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
