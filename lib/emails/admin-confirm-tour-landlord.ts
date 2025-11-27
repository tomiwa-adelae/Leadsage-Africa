import { env } from "../env";

interface Props {
  landlordName: string;
  tenantName: string;
  location: string;
  date: string;
  time: string;
  category: string;
  price: any;
  id: string;
}

export const adminConfirmTourLandlord = ({
  landlordName,
  tenantName,
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
      <h1 class="text-2xl font-medium mb-2">✅ Tour Confirmed</h1>
      <p class="opacity-90 m-0">Your property viewing has been approved by Leadsage Admin</p>
    </div>

    <div class="p-10">
      <p class="mb-6 text-gray-700 leading-relaxed">
        Hi <span class="font-bold">${landlordName}</span>,<br /><br />
        The tour request by
        <span class="font-bold">${tenantName}</span> for your property at
        <span class="font-bold">${location}</span> has been
        <span class="text-green-600 font-medium">confirmed by Leadsage Admin</span>.
      </p>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-5 my-6 rounded-r-lg">
        <h3 class="text-lg font-medium text-gray-800 mb-4">📅 Tour Details</h3>
        <ul class="space-y-2 text-gray-700">
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
          <li><strong>Property Type:</strong> ${category}</li>
          <li><strong>Rent:</strong> ₦${price}</li>
        </ul>
      </div>

      <p class="text-gray-700 leading-relaxed">
        Please ensure the property is accessible at the scheduled time. If you have any conflicts, let us know immediately so we can assist with rescheduling.
      </p>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/landlord/dashboard"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-700"
        >
          View Dashboard
        </a>
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/landlord/bookings/${id}"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-700"
        >
          View booking details
        </a>
      </div>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        Need assistance? Contact us at
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>.
      </p>
    </div>
  </div>
</body>
</html>
`;
