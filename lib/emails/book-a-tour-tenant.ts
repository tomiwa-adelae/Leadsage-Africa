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
		<title>Tour Confirmation - Leadsage</title>
		<script src="https://cdn.tailwindcss.com"></script>
	</head>
	<body class="font-sans bg-gray-100 p-5">
		<div>
			<!-- HEADER -->
			<div class="text-center bg-blue-600 text-white py-10 rounded-lg shadow-md">
				<h1 class="text-3xl font-bold mb-2">🎉 Your Tour is Confirmed!</h1>
				<p class="opacity-90 m-0">We’re excited to show you your potential new home</p>
			</div>

			<!-- BODY -->
			<div class="p-10 bg-white shadow-md rounded-lg mt-6">
				<div class="text-lg text-gray-800 mb-5">
					Hi <span class="font-bold">${name}</span>,
				</div>

				<p class="mb-6 text-gray-700 leading-relaxed">
					Your property viewing is scheduled and confirmed for the listing at
					<span class="font-bold">${location}</span>. Here are the details:
				</p>

				<!-- TOUR DETAILS -->
				<div class="bg-blue-50 border-l-4 border-blue-500 p-5 my-6 rounded-r-lg shadow-sm">
					<h3 class="text-lg font-semibold text-gray-800 mb-4">📅 Tour Details</h3>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
						<p><span class="font-semibold">Date:</span> ${date}</p>
						<p><span class="font-semibold">Time:</span> ${time}</p>
						<p><span class="font-semibold">Property Type:</span> ${category}</p>
						<p><span class="font-semibold">Rent:</span> ₦${price}</p>
						<p class="sm:col-span-2"><span class="font-semibold">Meeting Point:</span> ${location}</p>
					</div>
				</div>

				<!-- REMINDERS -->
				<div class="bg-slate-50 p-5 rounded-lg my-5">
					<h4 class="font-semibold text-gray-800 mb-4">📋 What to Bring:</h4>
					<ul class="list-disc list-inside space-y-2 text-gray-600">
						<li>Valid photo ID</li>
						<li>Proof of income (if you’re interested in applying)</li>
						<li>Any questions you’d like to ask about the property</li>
					</ul>
				</div>

				<div class="p-5 rounded-lg my-5 text-center bg-yellow-50 border border-yellow-200">
					<h3 class="font-semibold text-gray-800 mb-2">⏰ Important Reminders</h3>
					<p class="text-gray-700 m-0">
						✔ Please arrive 5–10 minutes early<br/>
						✔ Give at least 2 hours notice if you need to reschedule<br/>
						✔ Feel free to take photos during the tour
					</p>
				</div>

				<!-- CTA BUTTONS -->
				<div class="text-center my-8">
					<a
						href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/dashboard"
						class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-semibold mx-2 my-2 hover:bg-blue-700 hover:transform hover:-translate-y-0.5 transition-transform"
					>
						View Your Dashboard
					</a>
					<a
						href="[Reschedule Link]"
						class="inline-block bg-gray-200 text-gray-800 py-3 px-8 rounded-full font-semibold mx-2 my-2 hover:bg-gray-300 hover:transform hover:-translate-y-0.5 transition-transform"
					>
						Reschedule Tour
					</a>
				</div>

				<p class="mb-4 text-gray-700 leading-relaxed">
					If you love the property, you can submit an application immediately
					after the tour through your dashboard!
				</p>

				<p class="text-gray-700 leading-relaxed">
					We’re excited for you to see this property! If you have any questions,
					don’t hesitate to reach out.
				</p>

				<!-- SUPPORT -->
				<div class="bg-blue-50 p-5 rounded-lg my-6 text-center">
					<h4 class="font-semibold text-gray-800 mb-3">📞 Contact Information</h4>
					<p class="m-0">
						<span class="font-semibold">Support Email:</span>
						<a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-600 font-semibold">
							${env.SUPPORT_EMAIL_ADDRESS}
						</a>
					</p>
					<p class="m-0">
						<span class="font-semibold">Phone:</span>
						<a href="tel:${env.NEXT_PUBLIC_LEADSAGE_PHONE_NUMBER}" class="text-blue-600 font-semibold">
							${env.NEXT_PUBLIC_LEADSAGE_PHONE_NUMBER}
						</a>
					</p>
				</div>
			</div>

			<!-- FOOTER -->
			<div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm mt-6 rounded-lg">
				<p class="font-bold text-white mb-2">Leadsage Africa</p>
				<p class="m-0">
					This tour was booked through Leadsage Africa<br/>
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
