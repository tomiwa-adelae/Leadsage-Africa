import { env } from "../env";

interface Props {
  tenantName: string;
  landlordName: string;
  location: string;
  date: string;
  time: string;
  category: string;
  price: string;
  id: string;
}

export const bookATourAdmin = ({
  tenantName,
  landlordName,
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
  <title>Leadsage Africa – Tour Alert</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <div>
      <h1 class="text-2xl font-semibold mb-2">📊 Tour Booking Alert</h1>
      <p class="opacity-90 m-0">A new property tour has been scheduled</p>
    </div>

    <div class="p-10">
      <p class="mb-6 text-gray-700 leading-relaxed">
        A tenant has booked a property viewing. Here are the details:
      </p>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-5 my-6 rounded-r-lg">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">🔎 Tour Details</h3>
        <ul class="space-y-2 text-gray-700">
          <li><strong>Tenant:</strong> ${tenantName}</li>
          <li><strong>Landlord:</strong> ${landlordName}</li>
          <li><strong>Location:</strong> ${location}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
          <li><strong>Property Type:</strong> ${category}</li>
          <li><strong>Rent:</strong> ₦${price}</li>
        </ul>
      </div>

      <p class="text-gray-700 leading-relaxed mb-6">
        Please monitor this booking to ensure both parties follow through. You may need to step in if rescheduling or disputes occur.
      </p>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/admin/dashboard"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-semibold mx-2 my-2 hover:bg-blue-700"
        >
          Open Admin Dashboard
        </a>
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/admin/bookings/${id}"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-semibold mx-2 my-2 hover:bg-blue-700"
        >
          Check booking details
        </a>
      </div>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        This notification is for internal monitoring only.<br />
        For escalations, reach out to 
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>.
      </p>
    </div>
  </div>
</body>
</html>
`;
