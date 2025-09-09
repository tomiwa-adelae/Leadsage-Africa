import { env } from "../env";

interface Props {
  name: string;
  location: string;
  date: string;
  time: string;
  category: string;
  price: any;
  id: string;
}

export const adminConfirmTourTenant = ({
  name,
  location,
  date,
  time,
  category,
  price,
  id,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Leadsage Africa – Tour Confirmed</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <div>
      <h1 class="text-2xl font-semibold mb-2">✅ Tour Confirmed!</h1>
      <p class="opacity-90 m-0">Your property viewing has been officially approved</p>
    </div>

    <div class="p-10">
      <p class="mb-6 text-gray-700 leading-relaxed">
        Hi <span class="font-bold">${name}</span>,<br /><br />
        Good news! Your property tour at
        <span class="font-bold">${location}</span> has been
        <span class="text-green-600 font-semibold">confirmed by Leadsage Admin</span>.
      </p>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-5 my-6 rounded-r-lg">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">📅 Tour Details</h3>
        <ul class="space-y-2 text-gray-700">
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
          <li><strong>Property Type:</strong> ${category}</li>
          <li><strong>Rent:</strong> ₦${price}</li>
        </ul>
      </div>

      <p class="text-gray-700 leading-relaxed">
        Please make sure to arrive at the property on time. Don’t forget to bring any documents you may need in case you’re interested in applying on the spot.
      </p>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/dashboard"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-700"
        >
          View Dashboard
        </a>
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/bookings/${id}"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-700"
        >
          View booking details
        </a>
      </div>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        Questions? Contact us at
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>.
      </p>
    </div>
  </div>
</body>
</html>
`;
