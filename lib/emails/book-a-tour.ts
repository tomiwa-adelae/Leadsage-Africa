import { env } from "../env";

interface Props {
	name: string;
	location: string;
	date: string;
	time: string;
	category: string;
	price: string;
}

export const bookATourTenant = ({
	name,
	location,
	date,
	time,
	category,
	price,
}: Props) => `
    <!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Rental Platform Email Templates</title>
		<script src="https://cdn.tailwindcss.com"></script>
	<body class="font-sans bg-gray-100 p-5">
		<div
		>
			<div>
				<h1 class="text-2xl font-semibold mb-2">Tour Confirmed!</h1>
				<p class="opacity-90 m-0">Your property viewing is all set</p>
			</div>

			<div class="p-10">
				<div class="text-lg text-gray-800 mb-5">
					Hi <span class="font-bold">${name}</span>,
				</div>

				<p class="mb-6 text-gray-700 leading-relaxed">
					Great news! Your tour has been confirmed for the property at
					<span class="font-bold">${location}</span>.
				</p>

				<div
					class="bg-blue-50 border-l-4 border-blue-500 p-5 my-6 rounded-r-lg"
				>
					<h3 class="text-lg font-semibold text-gray-800 mb-4">
						📅 Tour Details
					</h3>
					<div class="space-y-2">
						<div class="flex flex-col sm:flex-row sm:items-center">
							<span
								class="font-semibold text-gray-600 sm:min-w-32 mb-1 sm:mb-0"
								>Date:</span
							>
							<span class="text-gray-800 font-bold">${date}</span>
						</div>
						<div class="flex flex-col sm:flex-row sm:items-center">
							<span
								class="font-semibold text-gray-600 sm:min-w-32 mb-1 sm:mb-0"
								>Time:</span
							>
							<span class="text-gray-800 font-bold">${time}</span>
						</div>
						<div class="flex flex-col sm:flex-row sm:items-center">
							<span
								class="font-semibold text-gray-600 sm:min-w-32 mb-1 sm:mb-0"
								>Property Type:</span
							>
							<span class="text-gray-800">${category}</span>
						</div>
						<div class="flex flex-col sm:flex-row sm:items-center">
							<span
								class="font-semibold text-gray-600 sm:min-w-32 mb-1 sm:mb-0"
								>Monthly Rent:</span
							>
							<span class="text-gray-800 font-bold"
								>₦${price}</span
							>
						</div>
						<div class="flex flex-col sm:flex-row sm:items-center">
							<span
								class="font-semibold text-gray-600 sm:min-w-32 mb-1 sm:mb-0"
								>Meeting Point:</span
							>
							<span class="text-gray-800">${location}</span>
						</div>
					</div>
				</div>

				<div class="bg-slate-50 p-5 rounded-lg my-5">
					<h4 class="font-semibold text-gray-800 mb-4">
						📋 What to Bring:
					</h4>
					<ul class="list-disc list-inside space-y-2 text-gray-600">
						<li>Valid photo ID</li>
						<li>
							Proof of income (if you're interested in applying)
						</li>
						<li>
							Any questions you'd like to ask about the property
						</li>
					</ul>
				</div>

				<div class="p-5 rounded-lg my-5 text-center">
					<h3 class="font-semibold text-gray-800 mb-2">
						⏰ Important Reminders
					</h3>
					<p class="text-gray-700 m-0">
						Please arrive 5 minutes early • Give 2+ hours notice for
						changes • Feel free to take photos during the tour
					</p>
				</div>

				<div class="bg-blue-50 p-5 rounded-lg my-6 text-center">
					<h4 class="font-semibold text-gray-800 mb-3">
						📞 Contact Information
					</h4>
					<p class="m-0">
						<span class="font-semibold">Our Support:</span>
						<a
							href="tel:${env.NEXT_PUBLIC_LEADSAGE_PHONE_NUMBER}"
							class="text-blue-600 font-semibold hover:text-blue-800"
							>${env.NEXT_PUBLIC_LEADSAGE_PHONE_NUMBER}</a
						>
					</p>
				</div>

				<div class="text-center my-8">
					<a
						href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/dashboard"
						class="inline-block text-white py-3 px-8 rounded-full font-semibold mx-2 my-2 hover:transform hover:-translate-y-0.5 transition-transform"
						>View Your Dashboard</a
					>
					<a
						href="[Reschedule Link]"
						class="inline-block text-white py-3 px-8 rounded-full font-semibold mx-2 my-2 hover:transform hover:-translate-y-0.5 transition-transform"
						>Reschedule Tour</a
					>
				</div>

				<p class="mb-4 text-gray-700 leading-relaxed">
					If you love the property, you can submit an application
					immediately after the tour through your dashboard!
				</p>

				<p class="text-gray-700 leading-relaxed">
					We're excited for you to see this property! If you have any
					questions, don't hesitate to reach out.
				</p>
			</div>

			<div
				class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm"
			>
				<p class="font-bold text-white mb-2">Leadsage Africa</p>
				<p class="m-0">
					This tour was booked through Leadsage Africa<br />
					For support, visit
					<a
						href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}"
						class="text-blue-400 hover:text-blue-300"
						>Leadsage Africa</a
					>
					or call
					<a
						href="tel:${env.NEXT_PUBLIC_LEADSAGE_PHONE_NUMBER}"
						class="text-blue-400 hover:text-blue-300"
						>${env.NEXT_PUBLIC_LEADSAGE_PHONE_NUMBER}</a
					>
				</p>
			</div>
		</div>
	</body>
</html>

`;
