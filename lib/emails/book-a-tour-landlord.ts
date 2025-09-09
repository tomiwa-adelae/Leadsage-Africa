import { env } from "../env";

interface Props {
  landlordName: string;
  tenantName: string;
  location: string;
  date: string;
  time: string;
  category: string;
  price: string;
}

export const bookATourLandlord = ({
  landlordName,
  tenantName,
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
  <title>Leadsage Africa – Tour Notification</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <div>
      <h1 class="text-2xl font-semibold mb-2">📢 New Tour Booked!</h1>
      <p class="opacity-90 m-0">A tenant has scheduled a property viewing</p>
    </div>

    <div class="p-10">
      <p class="mb-6 text-gray-700 leading-relaxed">
        Hi <span class="font-bold">${landlordName}</span>,<br /><br />
        Great news! <span class="font-bold">${tenantName}</span> has booked a tour of your property at 
        <span class="font-bold">${location}</span>.
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

      <div class="bg-slate-50 p-5 rounded-lg my-5">
        <h4 class="font-semibold text-gray-800 mb-3">✅ What You Should Do</h4>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li>Confirm the meeting point at ${location}</li>
          <li>Be on time and have the property accessible</li>
          <li>Prepare any documents (e.g. rental requirements, application forms)</li>
        </ul>
      </div>

      <p class="text-gray-700 leading-relaxed mb-6">
        Please contact the tenant directly on the day if necessary. You can also manage your bookings in your dashboard.
      </p>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/landlord/dashboard"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-semibold mx-2 my-2 hover:bg-blue-700"
        >
          View Dashboard
        </a>
      </div>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        This tour was booked through Leadsage Africa.<br />
        For support, contact us at 
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>.
      </p>
    </div>
  </div>
</body>
</html>
`;
